var connect = require('connect'),
	static = require('serve-static'),
	Path = require('path');

connect().use(static(Path.join(__dirname, 'pub'))).listen(3030, function() {
	console.log('server running on 3030');
});
