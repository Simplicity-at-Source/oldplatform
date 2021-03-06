var  http = require('http');

var  bodyLogLength = 200;


exports.getJson = function(host, port, path, clientCallback, errCallback) {   
    var opts = {
        method: 'GET',
        hostname: host,
        host: host,
        port: port,
        path: path,
        headers: ['Accept: application/json']
    };
    
    var callback = function(response) {
        var body = '';
        
        response.on('data', function(chunk){
            body += chunk;
        });
        
        response.on('error', function(chunk){
            console.log('asyncJsonApiHttpGet() error=' + err.message);  
            errCallback(err);
        });

        response.on('end', function() {
            console.log('httpio: %s http://%s:%s%s ==> %s ',  opts.method, opts.host, opts.port, opts.path, JSON.stringify(body).substring(0, bodyLogLength));  
            clientCallback(body);
        });
    };
    
    //console.log('asyncJsonApiHttpGet() creating request %s http://%s:%s%s', opts.method, opts.host, opts.port, opts.path);  
    var httpRequest = http.request(opts, callback);
    
    httpRequest.on('error', function(err){
        console.log('asyncJsonApiHttpGet() error=' + err.message);  
        errCallback(err);
    });

    httpRequest.end();
    
};