var sw = require("swagger-node-express");
var url = require("url");
var request = require("superagent");
var swe = sw.errors;

var dockerPort = process.env.SP_DOCKER_PORT || 4321;
var dockerIp = process.env.SP_DOCKER_HOST || 'localhost';
var nucleusPort = process.env.SP_NUCLEUS_PORT || 8080;
var nucleusHost = process.env.SP_NUCLEUS_HOST || 'localhost';

var dockerUrl = 'http://' + dockerIp + ':' + dockerPort;
var nucleusUrl = 'http://' + nucleusHost + ':' + nucleusPort;





exports.containers = {
  'spec': {
    description : "Return all docker containers for this control-plane",  
    path : "/container",
    method: "GET",
    summary : "Return all containers",
    notes : "Returns all containers records in docker",
    type : "array",
    nickname : "containersList",
    produces : ["application/json"],
    parameters : [],
    responseMessages : [swe.notFound('container')]
  },
  'action': function (req,res) {
        console.log('resources.js containers()');
      
        var req = request.get(dockerUrl + '/containers/json');
        req.end(function(dockerRes){
            console.log("resources.js containers() GET /containers/json req.end() res.text=" + dockerRes.text);
            var json = dockerRes.text;
            res.send(json);        
        });
      
        
  }
};


