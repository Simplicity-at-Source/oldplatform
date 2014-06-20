var assert = require('assert');
var url = require('url');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8080';
var http = require('http');
var msh = require('msh');
var _ = require('underscore');

var testFile = 'testControlPlane.js';

var testLog = testFile + '';


var mockDockerPort = process.env.SP_DOCKER_PORT || 14321;
var mockNucleusPort = process.env.SP_NUCLEUS_PORT || 18080;

var testService = 'control-plane';



describe('test ' + testService +': ', function(){

    it(testFile + ' /container works ok', function(done){
        var req = request.get(host + '/container');
        req.end(function(res){
            var ids = ['fa2fa401397c102ae556ca2715f194a587f6a01bdf92e2112e8038b8f7b9afbb', '04e20287aa7b3f9b1ae3817975c87b54a9015c82c672b4b738f5aad2d681d6cc'];            
             log('GET /container', 'res.text', res.text);
            var json = JSON.parse(res.text);
            assert.equal(200, res.status);
            var id1 = _.findWhere(json, {Id: ids[0]});
            var id2 = _.findWhere(json, {Id: ids[1]});
            log('GET /container', 'id1', id1);
            assert.equal(ids[0], id1.Id);
            assert.equal(ids[1], id2.Id);
            done();
        });
    });
});







function log(testname, dataName, data) {
    var dataStr = data; 
    try {
        dataStr = JSON.stringify(data);    
    }catch (e) {  }
    var logLength = dataStr < 100 ? dataStr.length : 100;
    console.log('LOGGER ********** ' + testFile + " " + testname + " " + dataName + ": " + dataStr.substring(0, 100));
}







//create mock remote docker API  
http.createServer(dockerApiHandler).listen(mockDockerPort, function() {
    console.log("starting mock docker api server on port " + mockDockerPort);
} );


/*
http.createServer(nulcleusApiHandler).listen(mockNucleusPort, function() {
    console.log("starting mock nucleus api server on port " + mockNucleusPort);
} );
*/




function dockerApiHandler(req, res) { 
   var url_parts = url.parse(req.url);
   console.log('dockerApiHandler url path: ' + url_parts.path);    
   if (url_parts.path == '/containers/json') {
      console.log('mockDockerApi GET /containers/json writing dockerContainersListJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(dockerContainersListJson()) );
      res.end(); 
   } else if (url_parts.path == '/service/gene-store/substore/cell') {
      console.log('mockDockerApi, writing phenotypeJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({message: "test"}) );
      res.end();        
       
   } else {
      console.log('mockDockerApi, no match for ' + url_parts.path);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({error: "no record found matching " + url_parts.path}) );      
      res.end();  
       
   }
   
}


/*

function nulcleusApiHandler(req, res) { 
   var url_parts = url.parse(req.url);
   console.log('nulcleusApiHandler url path: ' + url_parts.path);    
   if (url_parts.path == '/service/pokemon?qk=inspection.Config.Env&qv=simplenode.muon.cistechfutures.net') {
      console.log('mockNucleusApi GET /service/pokemon/substore/muon writing nucleusJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(nucleusJson()) );
      res.end(); 
   } else if (url_parts.path == '/service/gene-store/substore/cell') {
      console.log('mockDockerApi, writing phenotypeJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({message: "test"}) );
      res.end();        
       
   } else {
      console.log('mockDockerApi, no match for ' + url_parts.path);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({error: "no record found matching " + url_parts.path}) );      
      res.end();  
       
   }
   
}

*/



function dockerContainersListJson() {
    
    return [
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 22
         },
         {
            "Type" : "tcp",
            "PrivatePort" : 8087
         },
         {
            "Type" : "tcp",
            "PrivatePort" : 8098
         }
      ],
      "Command" : "/usr/bin/supervisord",
      "Names" : [
         "/sp-riak_node"
      ],
      "Id" : "fa2fa401397c102ae556ca2715f194a587f6a01bdf92e2112e8038b8f7b9afbb",
      "Status" : "Up 39 minutes",
      "Created" : 1403274927,
      "Image" : "sp_platform/spi_riak_node:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8080
         }
      ],
      "Command" : "/bin/sh -c /run.sh /sbin/my_init",
      "Names" : [
         "/sp-riak_expressor"
      ],
      "Id" : "04e20287aa7b3f9b1ae3817975c87b54a9015c82c672b4b738f5aad2d681d6cc",
      "Status" : "Up 39 minutes",
      "Created" : 1403274925,
      "Image" : "sp_platform/spi_riak_expressor:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8080
         }
      ],
      "Command" : "/bin/sh -c /run.sh /sbin/my_init",
      "Names" : [
         "/sp-stateless_expressor"
      ],
      "Id" : "742b034f29f76e4e9bff26eb45b148f9f2fd3f22ac4ef6be27fc709e95714dc6",
      "Status" : "Up 39 minutes",
      "Created" : 1403274924,
      "Image" : "sp_platform/spi_stateless_expressor:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8080
         }
      ],
      "Command" : "/bin/sh -c /run.sh /sbin/my_init",
      "Names" : [
         "/sp-cell_expressor"
      ],
      "Id" : "5edd83f733e46ebe86d2010cc8dec281ba3ca87296f5fb0df8fa1913da49bbf4",
      "Status" : "Up 39 minutes",
      "Created" : 1403274923,
      "Image" : "sp_platform/spi_cell_expressor:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8888
         }
      ],
      "Command" : "/bin/sh -c '/spaas/nodejs/bin/node app.js'",
      "Names" : [
         "/sp-gns"
      ],
      "Id" : "e6ae6c5d354fe87bb5897baead37b5f54040ec001dd1408ec12681f26212eff2",
      "Status" : "Up 39 minutes",
      "Created" : 1403274922,
      "Image" : "sp_platform/spi_gns:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8080
         }
      ],
      "Command" : "/bin/sh -c '/bin/sh /spaas/project/run.sh'",
      "Names" : [
         "/sp-nucleus"
      ],
      "Id" : "364ea3d9fccd2080b8393baf0bc60bf4d381a96aac268e9f50f1d66153173354",
      "Status" : "Up 39 minutes",
      "Created" : 1403274921,
      "Image" : "sp_platform/spi_nucleus:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8888,
            "PublicPort" : 80,
            "IP" : "0.0.0.0"
         }
      ],
      "Command" : "/bin/sh -c '/spaas/nodejs/bin/node app.js'",
      "Names" : [
         "/sp-sp_proxy"
      ],
      "Id" : "b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a",
      "Status" : "Up 39 minutes",
      "Created" : 1403274920,
      "Image" : "sp_platform/spi_sp_proxy:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8080
         }
      ],
      "Command" : "/bin/sh -c /run.sh /sbin/my_init",
      "Names" : [
         "/sp-control_plane"
      ],
      "Id" : "cdcd5e8468579484e455cb3877c50cb99bffe4b475107b97ce2d0eb3d86eaaab",
      "Status" : "Up 39 minutes",
      "Created" : 1403274909,
      "Image" : "sp_platform/spi_control_plane:latest"
   }
];
}





