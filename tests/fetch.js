var weatherTW = require('../');

var fetcher = weatherTW.fetch('YOURACCESSKEY');

var parser = weatherTW.parse();

parser.on('data', function(data) {
	console.log(data);
});

fetcher.pipe(parser);
