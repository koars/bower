var bower = require('main-bower-files');
var send = require('koa-send');
var path = require('path');
var koars = require('koars-utils')({module: 'assets', asset:'bower-assets'});
var bpath = require('./location')();

module.exports = function bowerAssets() {
	var files = bower();

	return function *(pth, next) {
		var absPath = path.join(bpath, pth || '');
		if(files.indexOf(absPath) !== -1 && path.extname(absPath) !== '.js' && path.extname(absPath) !== '.css') {
			yield send(this, absPath);
		} else {
			yield next;
		}
	};
};