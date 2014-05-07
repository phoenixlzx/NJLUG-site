NJLUG-site
==========

Home page for Nanjing Linux User Group.

Yet you could use it for your LUGs.

**THIS APPLICATION IS STILL UNDER DEVELOPMENT. USE AT YOUR OWN RISK.**

### Requirement

* Linux
* Python 2.5 - 3.0
* Node.js 0.10.26+

### Setup

* clone to localhost
* copy `config.js.example` to `config.js` and edit for your needs.
* `npm install`
* `./bin/lughome`

Note: if you get node-gyp python error on some newer system, try add `--python=/bin/python2` to `npm install` command.

### Config

* `config.js`

The file is fully documented. Copy `config.js.example` to `config.js` and edit it as you need.

* `userdata/planet.list`

This is the feed list for LUG users. One per line. format:

`Name|http://example.com/feed.xml`

* `userdata/pages/*.md`

`home.md` is the content shows in homepage, `about.md` is the one in about page.

`about_widget.md` will be shown on the sidebar.

All files are in Github-flavored-Markdown format.

### License

The MIT License (MIT)

Copyright (c) 2014 Phoenix Nemo

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
