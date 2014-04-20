var  http = require('http');




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
            console.log('asyncJsonApiHttpGet() end data=' + JSON.stringify(body).substring(0, 120));  
            clientCallback(body);
        });
    };
    
    console.log('asyncJsonApiHttpGet() creating request %s http://%s:%s%s', opts.method, opts.host, opts.port, opts.path);  
    var httpRequest = http.request(opts, callback);
    
    httpRequest.on('error', function(err){
        console.log('asyncJsonApiHttpGet() error=' + err.message);  
        errCallback(err);
    });

    httpRequest.end();
    
};