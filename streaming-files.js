var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.css' : 'text/css'
};

var cache = {};

function onRequest ( request, response ) {
	var lookup = path.basename(decodeURI(request.url)) || 'index.html';
	var f = 'content/' + lookup;

	fs.exists(f, function (exists) {
		if (exists)
		{
			var headers = {'Content-Type' : mimeTypes[path.extname(f)]};

			if (cache[f])
			{
				response.writeHead(200, headers);
				response.end(cache[f].content);
				return;
			}
		}
		response.writeHead(404, {"Content-Type": "text/html"});
		response.end("<h1>Page Not Found</h1>");
	});
}

http.createServer(onRequest).listen(1337);

console.log("Server started at \"http://127.0.0.1:1337\"");