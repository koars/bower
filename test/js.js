var koa = require('koa');
var request = require('supertest');
var bower = require('../index.js');

describe('The js middleware', function() {
	var app;

	beforeEach(function() {
		app = koa();
		app.use(bower.js());
	});
	
	it('serves the js corectly', function(done) {
		request(app.listen())
			.get('/')
			.expect(200)
			.expect('JS1JS2')
			.end(done);
	});
});