var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
  '.js' : 'text/javascript',
  '.html' : 'text/html',
  '.css' : 'text/css'
};

var cache = {
  store: {},
  maxSize: 26214400 //bytes
};

function onRequest ( request, response ) {
  var lookup = path.basename(decodeURI(request.url)) || 'index.html';
  var f = 'content/' + lookup;

  fs.exists(f, function (exists) {
    if (exists)
  {
    var headers = {'Content-Type' : mimeTypes[path.extname(f)]};

    var s = fs.createReadStream(f).once('open', function () {
      fs.stat(f, function ( err, stats ) {
        var bufferOffset = 0;
        cache[f] = {content: new Buffer(stats.size)};

        s.on('data', function ( chunk ) {
          chunk.copy(cache[f].content, bufferOffset);
          bufferOffset += chunk.length;
        });
      });

      response.writeHead(200, headers);
      this.pipe(response);
    }).once('error', function ( e ) {
      console.log(e);
      response.writeHead(500, {"Content-Type" : "text/html"});
      response.end("<h1>Server Error!</h1>");
    });

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
