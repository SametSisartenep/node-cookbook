var http = require('http');
var url = require('url');

var pages = [
	{id: '1', route: '', output: 'Woohoo!'},
	{id: '2', route: 'about', output: 'A simple routing with Node example.'},
	{id: '3', route: 'another page', output: function () {
		return "Here's " + this.route;
	}}
];

http.createServer(function ( request, response ) {
	var id = url.parse(decodeURI(request.url), true).query.id;

	if (id)
	{
		pages.forEach(function ( page ) {
			if (page.id === id)
			{
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end(typeof page.output === 'function' ? page.output() : page.output);
			}
		});
	}

	if (!response.finished)
	{
		response.writeHead(404, {"Content-Type": "text/html"});
		response.end("<h1>Page Not Found</h1>");
	}
	
}).listen(1337);

console.log("Server started at |http://127.0.0.1:1337|");