var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
  '.js' : 'text/javascript',
  '.html' : 'text/html',
  '.css' : 'text/css',
  '.7z' : 'application/x-7z-compressed',
  '.pdf' : 'application/x-pdf'
};

http.createServer(function ( request, response ) {
  var lookup = path.basename(decodeURI(request.url)) || 'index.html';

  var f = 'content/' + lookup;

  console.log("Request for " + f + " received.");

  fs.exists(f, function ( exists ) {
    if (exists)
  {
    fs.readFile(f, function ( err, data ) {
      if (err)
    {
      response.writeHead(500);
      response.end('Server Error!');
      console.log("(500) Server Error");
      return;
    }

    var headers = {'Content-Type' : mimeTypes[path.extname(lookup)]};

    response.writeHead(200, headers);
    response.end(data);
    console.log("File: " + f + " correctly send.");
    });
    return;
  }
  response.writeHead(404);
  response.end();
  console.log("File: " + f + " Not Found.");
  });
}).listen(1337, function () {
  console.log("Server started at |http://127.0.0.1:1337|");
});
