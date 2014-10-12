var bower = require('main-bower-files');
var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('fs'));
var koars = require('koars-utils')({module: 'assets', asset:'bower-css'});
var path = require('path');
var bpath = require('./location')();

module.exports = function bowerCSS(basepath) {
	basepath = basepath || '';
	var cache = compile(basepath);

	return function *() {
		var data = yield cache;

		this.body = data.data;
		this.lastModified = data.time;
		this.type = 'text/css';
	};
};

function compile(basepath) {
	var files = bower().filter(function(file) {
		return path.extname(file) === '.css';
	});

	return bluebird
		.map(files, function(file) {
			return fs.readFileAsync(file, {encoding: 'utf8'}).then(function(content) {
				return rewriteUrl(basepath, file, content);
			});
		})
		.reduce(function(sum, file) {
			return sum + file;
		}, '')
		.then(function(result) {
			koars.log.debug('Rebuilt bower css bundle');

			return {
				data: result,
				time: new Date()
			};
		});
}

function rewriteUrl(basepath, filename, content) {
	var regex = /url\(['"](.*?)['"]\)/g;
	return content.replace(regex, function(args, srcUrl) {
		var fullUrl = path.join(path.dirname(filename), srcUrl);
		var targetUrl = koars.basepath() + basepath + path.relative(bpath, fullUrl).split(path.sep).join('/');

		return 'url("'+targetUrl+'")';
	});
}