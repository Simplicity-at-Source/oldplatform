var http = require('http');
var url = require('url');


var mockRegistryPort = process.env.SP_REGISTRY_PORT;

mockEndpointPort = 13001;



function mockSimpleServiceHandler(req, res) {
    var requestUrl = url.parse(req.url, true, false);
    console.log('mockSimpleServiceHandler() url path: %s', requestUrl.path );
    if (requestUrl.path == '/blah/some/path') {
       res.writeHead(200, {'Content-Type': 'text/plain'});
       res.write('mockSimpleServiceHandler: Hello, World!');
       res.end();
    } else {
       res.writeHead(404, {'Content-Type': 'text/plain'});
       res.write(JSON.stringify({message: "no mapping for /path: " + requestUrl.path}));
       res.end();  
        
    }
}

function mockRegistryHandler(req, res) { 
    var requestUrl = url.parse(req.url, true, false);  
    var servicename = requestUrl.path.split('/')[2];
     console.log('mockRegistryHandler() url path: %s servicename: %s', requestUrl.path, servicename);
    if (servicename == 'simpleservice') {
       res.writeHead(200, {'Content-Type': 'application/json'});
       res.write(JSON.stringify({host: 'localhost', port: mockEndpointPort}) );
       res.end(); 
    }  else {
       res.writeHead(404, {'Content-Type': 'application/json'});
       res.write(JSON.stringify({message: "error no matching service name in mockDockerHandler()"}));
       res.end();
        
    }
}

function httpStartupComplete(service, port) {
    console.log("starting %s service on port %s", service, port);
}

//create mock endpoint service to test proxy with 
http.createServer(mockSimpleServiceHandler).listen(mockEndpointPort, httpStartupComplete("mock simplenode", mockEndpointPort));

//create mock registry
http.createServer(mockRegistryHandler).listen(mockRegistryPort, httpStartupComplete("mock registry", mockRegistryPort));

