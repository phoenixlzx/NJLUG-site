/*!
* node-feedparser
* Copyright(c) 2013 Dan MacTough <danmactough@gmail.com>
* MIT Licensed
*/

// This test script combined from https://github.com/danmactough/node-feedparser/blob/master/examples/

var FeedParser = require('feedparser'),
    request = require('request'),
    feed = 'http://blog.phoenixlzx.com/atom.xml';

var req = request(feed, {timeout: 10000, pool: false});
req.setMaxListeners(50);

var feedparser = new FeedParser();

feedparser.on('readable', function() {
    var post;
    while (post = this.read()) {
        // console.log(post.title + '\n' + post.description);
        console.log(post)
    }
});

req.on('error', done);

req.on('response', function(res) {
    var stream = this
        , iconv
        , charset;

    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    charset = getParams(res.headers['content-type'] || '').charset;

    // Use iconv if its not utf8 already.
    if (!iconv && charset && !/utf-*8/i.test(charset)) {
        try {
            iconv = new Iconv(charset, 'utf-8');
            console.log('Converting from charset %s to utf-8', charset);
            iconv.on('error', done);
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

feedparser.on('error', done);
feedparser.on('end', done);

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

function done(err) {
    if (err) {
        console.log(err, err.stack);
        return process.exit(1);
    }
    process.exit();
}
