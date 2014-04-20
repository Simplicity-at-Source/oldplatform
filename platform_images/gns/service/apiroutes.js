var _ = require("underscore");
var validator = require('validator');
var  http = require('http');
var services = {};

var dockerApiHostPort = process.env.DOCKER_API_HOST_PORT || "172.17.42.1:4321";



exports.new_service = function (req, res) {
  //console.log('exports.new_service() body=' + req.body);
  //console.dir(req.body);
  var body = {};       
    try {
        body = JSON.parse(req.body);
    } catch (e) {
        body = req.body;
    }
  var servicename = req.params.service_name;
  //console.log('exports.new_service(): service=' + servicename);
  body['link'] = "/service/" + servicename 
  services[servicename] = body;     
  //console.log("new_service() service data: " + JSON.stringify(services));
  var jsonResponse  = {service: servicename, status: "added"};
  //console.log("new_service() response:" + JSON.stringify(jsonResponse));
  res.send(JSON.stringify(jsonResponse));
};

function addNewService(servicename, host, port) {
    var body = {name: servicename, port: port, hosts: [host + ':' + port]};
    services[servicename] = body;    
}



exports.services = function (req, res) {
  //console.log('services()');
  res.send(JSON.stringify(services));
};

function find_from_docker(serviceName, res) {
    
     console.log('find_from_docker() unable to find service "' + serviceName + '" in memory, looking up docker services...');
        
        var errCallback = function(err) {
            //consol.log('ERROR in get_service()->errCallback()');
            console.dir(err); 
        }
        var nestedCallback = function(body) {           
            var dockerResponse = JSON.parse(body);
            //console.log('get_service()->nestedCallback() dockerResponse: ' + body );
            if (! dockerResponse.NetworkSettings) {
                send404(serviceName, res);
                return;
            }
            var ip = dockerResponse.NetworkSettings.IPAddress;
            var keys = dockerResponse.Config.ExposedPorts;
            var port = '';
            for (var key in keys) {
              port = key.split('/')[0];
            }
            //console.log("got ip/port from docker: " + ip + ':' + port);
            addNewService(serviceName, ip, port);
            sendHost(ip, port, serviceName, res);
        }
        
        var callback = function (body) { 
            //console.log('get_service()->callback()');
            var dockerResponse = JSON.parse(body);
            var dockerServiceInfo = _.filter(dockerResponse, function(entry) {return (entry.Names[0]  == '/' + serviceName);} );
            //console.log('get_service()->callback() dockerServiceInfo=' + JSON.stringify(dockerServiceInfo));             
            inspectContainer(serviceName, nestedCallback, errCallback);
        }

        listDockerContainers(callback, errCallback);
    
}

exports.get_service = function (req, res) {
  var serviceName = req.params.service_name;
  var service_data = services[serviceName];
    //console.log('get_service() service_data=' + JSON.stringify(service_data) );
    if ( service_data == undefined ) {
        //console.log('unable to find service in memory, looking up docker services...');
       find_from_docker(serviceName, res);
    } else {
        res.send(JSON.stringify(service_data));
    }
};



exports.add_host = function (req, res) {
  //console.log('add_host()');
  var service = req.params.service_name;
  var host = req.params.host;
  var port = req.params.port;
  //console.log('add_host() new host: ' + host + ':' + port);
  var service_data = services[service];
  //console.log('add_host() hosts before: ' + service_data.hosts);
  service_data.hosts.push(host + ':' + port);
  //console.log('add_host() hosts after: ' + service_data.hosts);
  //console.log('add_host() new service=' + JSON.stringify(service_data) );
  var jsonResponse  = {service: service, status: "added host " + host + ":" + port};
  //console.log("add_host() response:" + JSON.stringify(jsonResponse));
  res.send(JSON.stringify(jsonResponse));
};



exports.next_host = function(req, res) {
    var serviceName = req.params.service_name;
    console.log("next_host() for serviceName " + serviceName );
    var service_data = services[serviceName];
    
     if ( service_data == undefined ) {
       find_from_docker(serviceName, res);
       return;
    } 
    
    ////console.log("service data: " + JSON.stringify(service_data) );
    if ( service_data['counter'] == undefined ) {
        service_data['counter'] = 0;
        
    } 
    
    //console.log("counter: " + service_data.counter);
    //console.log("hosts: " + service_data.hosts.length); 
    var  newcounter = service_data.counter + 1;
    var modCounter = newcounter % service_data.hosts.length ;        
    ////console.log("newcounter: " + newcounter);
    ////console.log("%: " + modCounter );
    ////console.log(" 2 % 3: " + 3 % 2 );
    service_data['counter'] =  modCounter; 
    ////console.log("counter: " + service_data.counter);
    hostPort = service_data.hosts[service_data.counter];
    ////console.log("returning round robin host: " + hostPort);
    
    var host = hostPort.split(':')[0];
    var port = hostPort.split(':')[1];
    sendHost(host, port, serviceName, res);
};

function sendHost(host, port, serviceName, res) { 
    console.log("sendHost(host:%s, port:%s, service:%s, res:%s)", host, port, serviceName, res);
    if (! host) {
      send404(serviceName, res);
    } else {
        console.log("sendHost() returning host/port %s/%s for service %s", host, port, serviceName);
       res.send({host: host, port: port}); 
    }
    
}

function send404(serviceName, res) {
    console.log('send404() no matching host for serviceName=' + serviceName + " returning 404 message");
    res.send(404, JSON.stringify({message: 'no matching host found for name ' + serviceName}));  
}



exports.delete_host = function(req, res) {
    //console.log('delete_host()');
    var service = req.params.service_name;
    var host = req.params.host;
    var port = req.params.port;
    var hostPort = host + ':' + port;
    var service_data = services[service];   
    removeHostPort(service, hostPort);
    res.send({new_hosts: service_data.hosts});
};

function removeHostPort(service, hostPort) {
    //console.log('removeHostPort() hostPort: ' + hostPort);
    var service_data = services[service];   
    //console.log('removeHostPort() removing host/port for service: ' + service);
    service_data.hosts = _.filter(service_data.hosts, function(h) {return (h != hostPort);} );
    services[service] = service_data;
}


/*
function validateService(service_data) {
    return true;
    console.log("validating service data...");
    var valid = true;
    var isIp = function(e) {
       return ! validator.isIp(e);   
    }
    console.log("b4 _.find()");
    var hostscheck = _.find(service_data.hosts, isIp);
    console.log("after _.find()");
    if (hostscheck) {valid = false};
    console.log("is data valid? returning: " + valid);
    return valid;
};
*/



function listDockerContainers(callback, errCallback) {
    //console.log('listDockerContainers()');
    asyncJsonApiHttpGet(dockerApiHostPort.split(':')[0], dockerApiHostPort.split(':')[1], '/containers/json', callback, errCallback);   
};

function inspectContainer(name, callback, errCallback) {
    //console.log('inspectContainer()');
    asyncJsonApiHttpGet(dockerApiHostPort.split(':')[0], dockerApiHostPort.split(':')[1], '/containers/' + name + '/json', callback, errCallback);   
};


exports.debug = function (req, res) {
     res.send(JSON.stringify(services));
}



function asyncJsonApiHttpGet(host, port, path, clientCallback, errCallback) {   
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
            //console.log('asyncJsonApiHttpGet() error=' + err.message);  
            errCallback(err);
        });

        response.on('end', function() {
            //console.log('asyncJsonApiHttpGet() end data=' + JSON.stringify(body));  
            clientCallback(body);
        });
    };
    
    console.log('asyncJsonApiHttpGet() creating request with options=' + JSON.stringify(opts));  
    var httpRequest = http.request(opts, callback);
    
    httpRequest.on('error', function(err){
        //console.log('asyncJsonApiHttpGet() error=' + err.message);  
        errCallback(err);
    });

    httpRequest.end();
    
};







