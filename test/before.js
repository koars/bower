var rewire = require('rewire');
var bower = require('../index.js');
var FS = require('fs-mock');
var sinon = require('sinon');
var bluebird = require('bluebird');

bower.css = rewire('../lib/css.js');
bower.js = rewire('../lib/js.js');
bower.assets = rewire('../lib/assets.js');

var fsobj = {};
fsobj[process.cwd()] = {
	'bower_components': {
		'some': {
			'more.js': 'JS2',
			'file.js': 'JS1',
			'file.css': 'CSS2; url("deeper/url")',
			'file.png': ''
		},
		'another': {
			'file.css': 'CSS1'
		}
	}
};

var mocks = {
	fs: bluebird.promisifyAll(new FS(fsobj)),
	bower: sinon.stub().returns([
		process.cwd()+'/bower_components/some/file.js',
		process.cwd()+'/bower_components/another/file.css',
		process.cwd()+'/bower_components/some/more.js',
		process.cwd()+'/bower_components/some/file.css',
		process.cwd()+'/bower_components/some/file.png'
	])
};

bower.css.__set__(mocks);
bower.js.__set__(mocks);
bower.assets.__set__({bower: mocks.bower});