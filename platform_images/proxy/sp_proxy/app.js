var http = require('http');
var url = require('url');
var _ = require('underscore');
var httpio = require('./httpio.js');
var proxyUtils = require('./proxyUtils.js');

/*
 * CORE CONCEPTS
 *
 * Client - The source of the original request the proxy is responding to 
 * Proxy - This service
 * Registry - The service containing mappings for end point service-name to end point hostname/port 
 * Docker Rgsitry - DOcker Remote API Regsitry
 * End Point - The service the client wishes to contact
 *
 *
 */


var proxyPort = process.env.SP_PROXY_PORT || 8888;
var registryPort = process.env.SP_REGISTRY_PORT || 8888;
var registryHost = process.env.SP_REGISTRY_HOST || '172.17.0.6';
var dockerApiHost = process.env.SP_DOCKER_HOST || '172.17.42.1';
var dockerApiPort = process.env.SP_DOCKER_PORT || '4321';
var BAD_GATEWAY_RESPONSE_CODE = 502;

http.createServer(coreHandler).listen(proxyPort, httpStartupComplete);

function httpStartupComplete() {
    'use strict';
    console.log("To set Proxy Port/Docker REST Api/GNS Host:");
    console.log("export SP_PROXY_PORT=%s", proxyPort);
    console.log("export SP_DOCKER_HOST=%s", dockerApiHost);
    console.log("export SP_DOCKER_PORT=%s", dockerApiPort);
    console.log("export SP_REGISTRY_HOST=%s", registryHost);
    console.log("export SP_REGISTRY_PORT=%s", registryPort);
    console.log("starting sp proxy service http server on port " + proxyPort);
}

function coreHandler(clientRequest, clientResponse) {
    'use strict';
    clientRequest.clientIp = clientRequest.headers['x-forwarded-for'] || clientRequest.connection.remoteAddress;
    var requestUrl = url.parse(clientRequest.url, true, false);
    //console.log('coreHandler() proxy request url path: %s', requestUrl.path );
    var proxyCallbackHandler = proxyRequest(clientRequest, clientResponse);
    if (requestUrl.path.lastIndexOf('/spapi', 0) === 0 ) { // url path starts with /spapi
        var servicename = requestUrl.path.split('/')[2]; 
        if (! servicename) _sendBadGateway(servicename, clientResponse);
         console.log('coreHandler() proxy via /spapi url path servicename=' + servicename);
        dockerLookup(servicename,  clientResponse, proxyCallbackHandler); 
    } else {
        var servicename = clientRequest.headers.host;  
         if (! servicename) _sendBadGateway(servicename, clientResponse);
         console.log('coreHandler() proxy via host header servicename=' + servicename);
        registryLookup(servicename,  clientResponse, proxyCallbackHandler);    
    }
        
}


function dockerLookup(servicename, response, proxyCallbackHandler) {
    console.log('dockerLookup() servicename=' + servicename);
    var path = '/containers/' + servicename + '/json'; 
    var errCallback = function(err) {console.log("error contacting docker: " + err.message) };
    console.log("dockerApiHost=%s, dockerApiPort=%s",dockerApiHost, dockerApiPort);
    var dockerCallBack = function(body) {
        try {
            var dockerResponse = JSON.parse(body);
        } catch (err) {
            _sendBadGateway(servicename, response);
            return;   
        }
            //console.log("dockerCallBack() dockerResponse=" +body);        
        if (! dockerResponse.NetworkSettings) {
                _sendBadGateway(servicename, response);
                return;
            }
            var host = dockerResponse.NetworkSettings.IPAddress;
            var keys = dockerResponse.Config.ExposedPorts;
            var port = '';
            for (var key in keys) {
              port = key.split('/')[0];
            }
            console.log("got ip/port from docker: " + host + ':' + port);
            proxyCallbackHandler(host, port, true);
    }   
    
    httpio.getJson(dockerApiHost, dockerApiPort, path, dockerCallBack, errCallback);
}



function registryLookup(servicename, clientResponse, proxyCallbackHandler) {
    //console.log('registryLookup() servicename=' + servicename);
    var path = '/service/' + servicename + '/host/next'; 
    var errCallback = function(err) {console.log("error contacting registry: " + err.message) };
    var registryCallBack = function(body) {
        registryResponse = JSON.parse(body);
        //console.log("registryLookup()->registryCallBack() registryResponse=" +registryResponse);  
        if (! registryResponse.host) {
            _sendBadGateway(servicename, clientResponse);   
        }
        proxyCallbackHandler(registryResponse.host, registryResponse.port, false);
    }   
    httpio.getJson(registryHost, registryPort, path, registryCallBack, errCallback);
}


function proxyRequest(clientRequest, clientResponse) {
   'use strict';
   //console.log('proxyRequest() returning proxy function...');
   
    return function(host, port, clipPath) {  
          //console.log('proxyRequest() for host=' + host);
          var requestUrl = url.parse(clientRequest.url, true, false);
          var path = '';
            if (clipPath) {
                path = proxyUtils.convertApiPath(requestUrl.path);
            }
           //var host = clientRequest.headers.host;

            var options = {
                method: clientRequest.method,
                hostname: host,
                host: host,
                port: port,
                path: path,
                headers: clientRequest.headers
            };

            _.extend(options.headers, {
                host: host,
                "x-forwarded-for": clientRequest.clientIp
            });

         console.log('proxyRequest() creating proxy request to endpoint: ' + options.method + ' http://' + host + ':' + options.port + options.path);
            
        var endPointResponseFunction = endPointResponseHandler(clientRequest, clientResponse, options, host, requestUrl)
        var endPointRequest = http.request(options, endPointResponseFunction);


           endPointRequest.on('error', function (error) {
                console.log("proxyRequest() endPointRequest.on('error') err=" + error.message );
                clientResponse.statusCode = BAD_GATEWAY_RESPONSE_CODE;
                clientResponse.end();
            });

            clientRequest.on('data', function (data) {
                console.log("proxyRequest() endPointRequest.on('data') data=" + data);
                endPointRequest.write(data);
            });

            clientRequest.on('end', function () {
                //console.log("proxyRequest() endPointRequest.on('end')");
                endPointRequest.end();
              
            });
        
    }

}



function endPointResponseHandler(clientRequest, clientResponse, options, host, requestUrl) {

   //console.log("endPointResponseHandler() host=" + host);

    return function (endPointResponse) {
        clientResponse.statusCode = endPointResponse.statusCode;

        _.each(endPointResponse.headers, function (headerValue, headerKey) {
            clientResponse.setHeader(headerKey, headerValue);
        });

        endPointResponse.on('error', function (error) {
            console.log("endPointResponseHandler() endPointResponse.on('error') error=" + error);
            clientResponse.connection.destroy();

        });

        endPointResponse.on('data', function (chunk) {
            //console.log("endPointResponseHandler() endPointResponse.on('data') clientResponse.write chunk=" + chunk);
            clientResponse.write(chunk);
        });

        endPointResponse.on('end', function () {
            //console.log("endPointResponseHandler() endPointResponse.on('end') calling clientResponse.end() ");
            clientResponse.end();

        });

        endPointResponse.on('close', function () {
            // console.log("endPointResponseHandler() endPointResponse.on('close')");
            clientResponse.connection.destroy();
        });
    }

}



function _sendBadGateway(servicename, response) {
    'use strict';   
    console.log("bad request for service %s sending 502", servicename);
    response.statusCode = BAD_GATEWAY_RESPONSE_CODE;
    response.write(JSON.stringify({message: "no service " + servicename}));
    response.end();
}
