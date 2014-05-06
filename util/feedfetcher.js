var FeedParser = require('feedparser');
var Iconv = require('iconv').Iconv;
var request = require('request');
var async = require('async');
var fs = require('fs');
var config = require('../config');

var posts = [];

setInterval(update(function(err) {
    if (err) {
        console.log(err);
    }
}), config.feedInterval * 1000);

function update(cb) {
    // read feed list from planet.list
    // console.log('updating posts...');
    fs.readFile('./userdata/planet.list', 'utf8', function (err, list) {
        if (err) {
            return cb(err);
        }
        var feeds = [];
        var personalLinks = list.split("\n");
        async.eachSeries(personalLinks, function(personalLink, callback) {
            // console.log(personalLink.split("|")[1]);
            if (personalLink.indexOf("#") === 0 || (!personalLink)) {
                // ignore comment and empty lines.
                callback();
            } else {
                feeds.push(personalLink.split("|")[1]);
                callback();
            }
        }, function(err) {
            if (err) {
                return cb(err);
            }
            // get all user feeds.
            async.eachSeries(feeds, function(feed, callback) {
                fetch(feed, function(err) {
                    if (err) {
                        return callback(err);
                    }
                    callback();
                });
            }, function(err) {
                if (err) {
                    return cb(err);
                }
                fs.writeFile('./userdata/posts.array', JSON.stringify(posts), function (err) {
                    // console.log(posts);
                    cb(err);
                });
            });
        });
    });
}

function fetch(feed, callback) {
    // Define our streams
    var req = request(feed, {timeout: 10000, pool: false});
    req.setMaxListeners(50);
    // Some feeds do not respond without user-agent and accept headers.
    req.setHeader('user-agent', 'Mozilla/5.0 (X11; Linux x86_64; rv:29.0) Gecko/20100101 Firefox/29.0')
        .setHeader('accept', 'text/html,application/xhtml+xml');

    var feedparser = new FeedParser();

    // event handlers
    req.on('error', function(err) {
        callback(err);
    });

    req.on('response', function(res) {
        var stream = this,
            iconv,
            charset;

        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

        charset = getParams(res.headers['content-type'] || '').charset;

        // Use iconv if its not utf8 already.
        if (!iconv && charset && !/utf-*8/i.test(charset)) {
            try {
                iconv = new Iconv(charset, 'utf-8');
                console.log('Converting from charset %s to utf-8', charset);
                iconv.on('error', function(err) {
                    console.log(err);
                });
                // If we're using iconv, stream will be the output of iconv
                // otherwise it will remain the output of request
                stream = this.pipe(iconv);
            } catch(err) {
                this.emit('error', err);
            }
        }

        // And boom goes the dynamite
        stream.pipe(feedparser);
    });

    feedparser.on('error', function(err) {
        callback(err);
    });
    feedparser.on('end', function(err) {
        if (err) {
            callback(err);
        }
        callback();
    });
    feedparser.on('readable', function() {
        var post;
        while (post = this.read()) {
            posts.push({
                time: post.date,
                author: post.author,
                link: post.link,
                title: post.title,
                content: post.description
            });
        }
    });
}


function getParams(str) {
    var params = str.split(';').reduce(function (params, param) {
        var parts = param.split('=').map(function (part) { return part.trim(); });
        if (parts.length === 2) {
            params[parts[0]] = parts[1];
        }
        return params;
    }, {});
    return params;
}

exports.update = update;