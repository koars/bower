var koa = require('koa');
var route = require('koa-route');
var request = require('supertest');
var sinon = require('sinon');
var path = require('path');
var bower = require('../index.js');

describe('The asset middleware', function() {
	var spy, app;

	beforeEach(function() {
		spy = sinon.spy();
		bower.assets.__set__('send', spy);

		app = koa();
		app.use(route.get('/sub/:path*', bower.assets()));
	});
	
	it('calls koa-send with the correct file', function(done) {
		request(app.listen())
			.get('/sub/some/file.png')
			.end(function() {
				spy.calledOnce.must.be.true();
				spy.args[0][1].must.be(path.join(process.cwd(), 'bower_components/some/file.png'));
				done();
			});
	});

	it('returns 404 on invalid file', function(done) {
		request(app.listen())
			.get('/sub/no/file.js')
			.expect(404)
			.end(done);
	});
});