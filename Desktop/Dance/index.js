var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(request,response){
  var parsedUrl = url.parse(request.url);
  var resource = parsedUrl.pathname;
  fs.readFile('map.html', 'utf-8', function(error, data) {

    if(error){
      response.writeHead(500, {'Content-Type':'text/html'});
      response.end('500 Internal Server Error : '+error);
  
    }else{
      response.writeHead(200, {'Content-Type':'text/html'});
      response.end(data);
    }
    })
});

server.listen(8080, function(){
    console.log('Server is now running...');
});
