koars-bower
===========
[![Build Status](https://img.shields.io/travis/koars/bower.svg?style=flat)](https://travis-ci.org/koars/bower)

This module provides middleware to serve bower assets (including bundling of js and css files).

JavaScript
----------

	var js = require('koars-bower').js;
	var app = require('koa')();
	app.use(js());

The above code sample would serve the concatenated contents of all bower bundles javascript files on all routes.


CSS
---

	var css = require('koars-bower').css;
	var app = require('koa')();
	app.use(css('prefix/'));

Similarly to the javascript middleware, this will serve all concatenated css files on all routes. In addition, the middleware will prefix all `url()` entries in your css with the supplied path, so serving your images etc. on another route works without a hitch.


Assets (Images, Fonts etc.)
---------------------------

	var assets = require('koars-bower').assets;
	var route = require('koa-route');
	var app = require('koa')();
	app.use(route.get('/assets/:path*', assets));

To properly serve your other assets, we need to supply a path to our middleware. This path should be the first argument passed into the middleware and would suggest using [koa-route](https://github.com/koajs/route) to do this. This will serve anything that is not a `.css` or `.js` file.