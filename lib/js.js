var bower = require('main-bower-files');
var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('fs'));
var koars = require('koars-utils')({module: 'assets', asset:'bower-js'});
var path = require('path');

module.exports = function bowerJS() {
	var cache = compile();

	return function *() {
		var data = yield cache;

		this.body = data.data;
		this.lastModified = data.time;
		this.type = 'text/javascript';
	};
};

function compile() {
	var files = bower().filter(function(file) {
		return path.extname(file) === '.js';
	});

	return bluebird
		.map(files, function(file) {
			return fs.readFileAsync(file, {encoding: 'utf8'});
		})
		.reduce(function(sum, file) {
			return sum + file;
		}, '')
		.then(function(result) {
			koars.log.debug('Rebuilt bower js bundle');

			return {
				data: result,
				time: new Date()
			};
		});
}