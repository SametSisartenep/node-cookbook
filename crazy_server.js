var http = require('http');
var url = '';

http.createServer(function ( req, res ) {
  console.log(req.url);
  console.log('###################################');

  try {
    url = decodeURI(req.url);
  } catch (e) {
    console.error(e.stack);
  }
  console.log(url);

  res.writeHead(200, {
    'Content-Type' : 'text/html'
  });
  res.end('<html><head><meta charset="utf-8" /></head><body><h1>Hi, keep waiting.... until the end (ಠ‿ಠ)</h1></body></head></html>');
}).listen(process.env.PORT || 1333, function () {
  console.log('Server listening at => 127.0.0.1:1333');
});
