var http = require('http');
var url = require('url');
var _ = require('underscore');

/*
 * CORE CONCEPTS
 *
 * Client - The source of the original request the proxy is responding to 
 * Proxy - This service
 * Registry - The service containing mappings for end point service-name to end point hostname/port 
 * End Point - The service the client wishes to contact
 *
 *
 */

/*
Docker Variables"
  DB_PORT=tcp://172.17.0.8:6379
  SP_REGISTRY_PORT_8888_TCP=tcp://172.17.0.8:8888
  SP_REGISTRY_PORT_8888_TCP_PROTO=tcp
  SP_REGISTRY_PORT_8888_TCP_ADDR=172.17.0.8
  SP_REGISTRY_PORT_8888_TCP_PORT=8888
*/

var proxyPort = process.env.SP_PROXY_PORT || 8080;
var registryPort = process.env.SP_REGISTRY_PORT || 8888;
var registryHost = process.env.SP_REGISTRY_HOST || 'localhost';
var BAD_GATEWAY_RESPONSE_CODE = 502;

http.createServer(coreHandler).listen(proxyPort, httpStartupComplete);

function httpStartupComplete() {
    'use strict';
    console.log("env variables: " + JSON.stringify(process.env));
    console.log("env variable SP_REGISTRY_PORT_8888_TCP_PORT: " + process.env.SP_REGISTRY_PORT_8888_TCP_PORT);
    console.log("env variables SP_REGISTRY_PORT_8888_TCP_ADDR: " + process.env.SP_REGISTRY_PORT_8888_TCP_ADDR);
    console.log("starting sp proxy service http server on port " + proxyPort);
}

function coreHandler(clientRequest, clientResponse) {
    'use strict';
    clientRequest.clientIp = clientRequest.headers['x-forwarded-for'] || clientRequest.connection.remoteAddress;
    var servicename = clientRequest.headers.host;   
    console.log('coreHandler() client request for servicename=' + servicename);
    var proxyCallbackHandler = proxyRequest(clientRequest, clientResponse);
    registryLookup(servicename,  proxyCallbackHandler);
}


function registryLookup(servicename, proxyCallbackHandler) {
    console.log('registryLookup() servicename=' + servicename);
   
    
     var options = {
        method: 'GET',
        hostname: registryHost,
        host: registryHost,
        port: registryPort,
        path: '/service/' + servicename + '/host/next',
        headers: ['Accept: application/json']
    };
    
    registryCallback = function(response) {
        console.log('Reponse: ', response.statusCode, ' from ', registryHost);
        var body = '';
        
        response.on('data', function(chunk){
            console.log('registryLookup() response.on("data"): chunk=' + chunk);
            body += chunk;
        });
        
        response.on('error', function(chunk){
            console.log('registryLookup() response.on("error")');
        });

        response.on('end', function() {
            console.log('registryLookup() response.on("end") body=' + body);
            console.log('registryLookup() response.on("end") body=' + body.constructor);
            var hostResponse = {};       
            try {
                hostResponse = JSON.parse(body);
            } catch (e) {
                console.log('registryLookup() response.on("end") catch error=' + e);
                hostResponse = body;
            }
                
            
            console.log('registryLookup() response.on("end") hostResponse.host=' + hostResponse.host);
            proxyCallbackHandler(hostResponse.host, hostResponse.port);
        });
    };
    
    
   var registryRequest = http.request(options, registryCallback);
    registryRequest.on('error', function(e){
        console.log('registryLookup() registryRequest.on("error") Error: ', e.message);
        //_sendBadGateway();
    });
    
    console.log('registryLookup() creating request with options=' + JSON.stringify(options));
    console.log('registryLookup() creating request  ' + options.method + ' http://' + options.hostname + ':' + options.port + options.path);
    
    registryRequest.end();
    
}


function proxyRequest(clientRequest, clientResponse) {
    'use strict';
   console.log('proxyRequest() returning curried function');
  
    
    return function(host, port) {  
            console.log('proxyRequest() host=' + host);
          var requestUrl = url.parse(clientRequest.url, true, false);
           //var host = clientRequest.headers.host;

            var options = {
                method: clientRequest.method,
                hostname: host,
                host: host,
                port: port,
                path: requestUrl.path,
                headers: clientRequest.headers
            };

            _.extend(options.headers, {
                host: host,
                "x-forwarded-for": clientRequest.clientIp
            });

         console.log('proxyRequest() creating request for host "' + host + '" ' + options.method + ' http://' + host + ':' + options.port + options.path);
            
        var endPointResponseFunction = endPointResponseHandler(clientRequest, clientResponse, options, host, requestUrl)
        var endPointRequest = http.request(options, endPointResponseFunction);


           endPointRequest.on('error', function (error) {
                console.log("proxyRequest() endPointRequest.on('error')");
                clientResponse.statusCode = BAD_GATEWAY_RESPONSE_CODE;
                clientResponse.end();
            });

            clientRequest.on('data', function (data) {
                console.log("proxyRequest() endPointRequest.on('data') data=" + data);
                endPointRequest.write(data);
            });

            clientRequest.on('end', function () {
                console.log("proxyRequest() endPointRequest.on('end')");
                endPointRequest.end();
              
            });
        
    }

}

function _sendBadGateway(response) {
    'use strict';   
    response.statusCode = BAD_GATEWAY_RESPONSE_CODE;
    response.end();
}




function endPointResponseHandler(clientRequest, clientResponse, options, host, requestUrl) {

   console.log("endPointResponseHandler() host=" + host);

    return function (endPointResponse) {
        clientResponse.statusCode = endPointResponse.statusCode;

        _.each(endPointResponse.headers, function (headerValue, headerKey) {
            clientResponse.setHeader(headerKey, headerValue);
        });

        endPointResponse.on('error', function (error) {
            console.log("endPointResponseHandler() endPointResponse.on('error')");
            clientResponse.connection.destroy();

        });

        endPointResponse.on('data', function (chunk) {
            console.log("endPointResponseHandler() endPointResponse.on('data') clientResponse.write chunk=" + chunk);
            clientResponse.write(chunk);
        });

        endPointResponse.on('end', function () {
            console.log("endPointResponseHandler() endPointResponse.on('end') calling clientResponse.end() ");
            clientResponse.end();

        });

        endPointResponse.on('close', function () {
             console.log("endPointResponseHandler() endPointResponse.on('close')");
            clientResponse.connection.destroy();
        });
    }

}
