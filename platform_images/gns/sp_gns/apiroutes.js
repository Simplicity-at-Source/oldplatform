var _ = require("underscore");
var validator = require('validator');
var  http = require('http');
var  request = require('superagent');

var services = {};

/*

"DNSHOST=riak_node.dev.muon.io",
"DOMAIN=dev.muon.io",
"MUON_CONTROL_PLANE_IP=172.17.0.2",
"MUON_NUCLEUS_IP=172.17.0.4",
"MUON_NUCLEUS_PORT=8080",
"MUON_GNS_IP=172.17.0.5",
"MUON_GNS_PORT=8080",
"MUON_GNS_IP=172.17.0.3",
"MUON_GNS_PORT=8080",

*/

var nucleusHost = process.env.MUON_NUCLEUS_IP || undefined;
var nucleusPort =  process.env.MUON_NUCLEUS_PORT || undefined;

var nucleusApi = 'http://' + nucleusHost + ':' + nucleusPort;

console.log('********** nucleusApi=' + nucleusApi);

exports.next_host = function(req, res) {
    var serviceName = req.params.service_name;
    //console.log("next_host() for serviceName " + serviceName );

    var callback = function(response) {  
        
        //console.log('next_host() -> callback() ' );
        var allContainerIps = [];
        for (var i in response) {
            var entry = response[i];
            //console.log('next_host() -> callback() entry=' + JSON.stringify(entry).substring(0, 150) );
            var containerIpPort = getHostPort(serviceName, entry);   
            if (containerIpPort) allContainerIps.push(containerIpPort);
        }
        var randomNum = random(0, allContainerIps.length);
        var randomIpPort = allContainerIps[randomNum];
        if (! randomIpPort || randomIpPort == '') {
            send404(serviceName, res);   
        }
        //console.log('next_host() -> callback() random ip/port number %s: %s', randomNum, randomIpPort);
         var host = randomIpPort.split(':')[0];
        var port = randomIpPort.split(':')[1];
        sendHost(host, port, serviceName, res);
    }

   
    queryNucleus(serviceName, callback);
   
};


function random(low, high) {
     return Math.floor(Math.random() * (high - low) + low);
}


function queryNucleus(host, callback) {
        //console.log('queryNucleus() host=%s ', host );
        // /service/pokemon?qk=inspection.Config.Env&qv=simplenode.muon.cistechfutures.net
        var queryTerms = '/service/pokemon?qk=inspection.Config.Env&qv=' + host;
        console.log("queryNucleus() GET " + nucleusApi + queryTerms );
    	var req = request.get(nucleusApi + queryTerms);
        req.end(function(res){
          //console.log("queryNucleus() res: " + res.text.substring(0, 150));
    	   var response = JSON.parse(res.text);    
           callback(response); 
    	});
    
}

function getHostPort(serviceName, containerInfo) {

            //console.log('getHostPort() containerInfo=' + JSON.stringify(containerInfo).substring(0, 150) );
            if (! containerInfo.inspection && ! containerInfo.inspection.NetworkSettings) {
                return undefined;
            }
            var ip = containerInfo.inspection.NetworkSettings.IPAddress;
            var keys = containerInfo.inspection.Config.ExposedPorts;
            var port = '';
            for (var key in keys) {
              port = key.split('/')[0];
            }
            var result = ip + ':' + port;
            //console.log('getHostPort() result=' + result );
            return result;
}



function sendHost(host, port, serviceName, res) { 
    //console.log("sendHost(host:%s, port:%s, service:%s, res:%s)", host, port, serviceName, res);
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










