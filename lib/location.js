var path = require('path');
var fs = require('fs');

module.exports = function bowerPath() {
	try {
		var parsed = JSON.parse(fs.readFileSync('.bowerrc', 'utf8')).directory;
		return path.join(process.cwd(), parsed);
	} catch(e) {
		return path.join(process.cwd(), 'bower_components');
	}
};