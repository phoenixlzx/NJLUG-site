var express = require('express');
var router = express.Router();

var marked = require('marked');
var fs = require('fs');
var async = require('async');

var config = require('../config');

var update = require('../util/feedfetcher');

var widget_content = [];

fs.readFile('./userdata/pages/about_widget.md', 'utf8', function(err, widgetsrc) {
    if (err) {
        throw err;
    }
    widget_content[0] = marked(widgetsrc);
});

router.get('/', function(req, res) {
    fs.readFile('./userdata/pages/home.md', 'utf8', function(err, homesrc) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        res.render('home', {
            siteName: config.siteName,
            title: config.title,
            tagLine: config.tagline,
            content: marked(homesrc),
            widget: widget_content
        });
    });
});

router.get('/about', function(req, res) {
    fs.readFile('./userdata/pages/about.md', 'utf8', function(err, pagesrc) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        res.render('about', {
            siteName: config.siteName,
            title: config.title,
            tagLine: config.tagline,
            content: marked(pagesrc),
            widget: widget_content
        });
    });
});

router.get('/planet', function(req, res) {
// check whether feed data file exists.
    fs.exists('./userdata/posts.array', function (exists) {
        if (!exists) {
            // posts array does not exist, create now.
            update.update();
            res.send(200, 'Please wait while updating posts feed.');
        } else {
            fs.readFile('./userdata/posts.array', 'utf8', function(err, posts) {
                // parse array string to arrayt object.
                posts = JSON.parse(posts);
                res.render('planet', {
                    siteName: config.siteName,
                    title: config.title,
                    tagLine: config.tagline,
                    posts: posts,
                    widget: widget_content
                })
            });
        }
    });

});

module.exports = router;


