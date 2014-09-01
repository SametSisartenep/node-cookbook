var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.css' : 'text/css'
};

var cache = {};

function cacheAndDeliver ( f, cb ) {
	fs.stat(f, function ( err, stats ) {
		if (err) { return console.log("Oh no!, Error!", err);}

		var lastChanged = Date.parse(stats.ctime),
		isUpdated = (cache[f]) && lastChanged > cache[f].timestamp;

		if (!cache[f] || isUpdated)
		{
			fs.readFile(f, function ( err, data ) {
				console.log("loading " + f + " from file");

				if (!err)
				{
					cache[f] = {content: data, timestamp: Date.now()};
				}

				cb(err, data);
			});
			return;
		}

		console.log("loading " + f + " from cache");
		cb(null, cache[f].content);
	});	
}

function onRequest ( request, response ) {
	var lookup = path.basename(decodeURI(request.url)) || 'index.html';
	var f = 'content/' + lookup;

	fs.exists(f, function (exists) {
		if (exists)
		{
			cacheAndDeliver(f, function ( err, data ) {
				if (err)
				{
					response.writeHead(500, {"Content-Type": "text/html"});
					response.end("<h1>Server Error!</h1>");
					return;
				}

				var headers = {"Content-Type": mimeTypes[path.extname(f)]};

				response.writeHead(200, headers);
				response.end(data);
			});
			return;
		}
		response.writeHead(404, {"Content-Type": "text/html"});
		response.end("<h1>Page Not Found</h1>");
	});
}

http.createServer(onRequest).listen(1337);

console.log("Server started at \"http://127.0.0.1:1337\"");