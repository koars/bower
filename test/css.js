var rewire = require('rewire');
var FS = require('fs-mock');
var sinon = require('sinon');
var koa = require('koa');
var request = require('supertest');
var bower = require('../index.js');

describe('The css middleware', function() {
	var app;

	beforeEach(function() {
		app = koa();
		app.use(bower.css('base/'));
	});

	it('serves the css corectly', function(done) {
		request(app.listen())
			.get('/')
			.expect(200)
			.expect(/CSS1CSS2/)
			.end(done);
	});

	describe('without a basepath', function() {
		it('prefixes the css correctly with the assetpath', function(done) {
			request(app.listen())
				.get('/')
				.expect(200)
				.expect(/url\("base\/some\/deeper\/url"\)/)
				.end(done);				
		});
	});

	describe('with a basepath', function() {
		before(function() {
			process.env.BASEPATH = 'gbase/';
		});

		after(function() {
			delete process.env.BASEPATH;
		});

		it('prefixes correctly with basepath and assetpath', function(done) {
			request(app.listen())
				.get('/')
				.expect(200)
				.expect(/url\("gbase\/base\/some\/deeper\/url"\)/)
				.end(done);
		});
	});
});