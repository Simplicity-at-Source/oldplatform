var sw = require("swagger-node-express");
var url = require("url");
var msh = require('msh');
var request = require("superagent");
var transformer = require('./payloadTransformer.js');
var assert = require('assert');

var swe = sw.errors;

var dockerPort = process.env.SP_DOCKER_PORT || 4321;
var dockerIp = process.env.SP_DOCKER_HOST || '172.17.42.1';
var nucleusPort = process.env.SP_NUCLEUS_PORT || 8080;
var nucleusHost = process.env.SP_NUCLEUS_HOST || 'localhost';

var dockerUrl = 'http://' + dockerIp + ':' + dockerPort;
var nucleusUrl = 'http://' + nucleusHost + ':' + nucleusPort;


var pokemonPath = '/service/pokemon/substore/muon'


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
        console.log('resources.js containers() listing from ' + dockerUrl + '/containers/json');
      
        var req = request.get(dockerUrl + '/containers/json');
        req.end(function(dockerRes){
            console.log("resources.js containers() GET /containers/json req.end() res.text=" + dockerRes.text);
            var json = dockerRes.text;
            res.send(json);        
        });
      
        
  }
};









// the description will be picked up in the resource listing
exports.getContainer = {
  'spec': {
    description : "Find nucleus stored item by id",  
    path : "/container/{containerId}",
    method: "GET",
    summary : "Find container ID",
    notes : "Returns meta data for docker container based on ID",
    type : "Record",
    nickname : "getContainerId",
    produces : ["application/json"],
    parameters : [sw.pathParam("containerId", "ID of container to fetch", "string")],
    responseMessages : [swe.invalid('containerId'), swe.notFound('container')]
  },
  'action': function (req,res) {
     console.log('resources.js getContainer()');
    if (! req.params.containerId) {
      throw swe.invalid('containerId'); 
    }
      
    var containerId = req.params.containerId;

      console.log('resources.js containers()');
      
        var req = request.get(dockerUrl + '/containers/' + containerId + '/json');
        req.end(function(dockerRes){
            console.log("resources.js getContainer() GET /containers/" + containerId + "/json req.end() res.text=" + dockerRes.text);
            var json = dockerRes.text;
            if (json) {
                res.send(json);    
            } else {
                throw swe.notFound('container',res);
            }
            
        });
  }
};


exports.postContainer = {
  'spec': {
    description : "Create docker  container via control-plane",  
    path : "/container",
    method: "POST",
    summary : "Create container",
    notes : "Create docker containter suing json meta data",
    type : "Message",
    nickname : "postContainer",
    produces : ["application/json"],
    parameters : [sw.bodyParam("Payload", "Container meta data to be created in docker", "Payload")],
    responseMessages : [swe.notFound('payload'), swe.invalid('payload')]
  },
  'action': function (req,res) {
    
    console.log('resources.js postContainer() req.body=' + JSON.stringify(req.body));
    var payload = req.body;
      
      if (! payload) {
           throw swe.invalid('payload'); 
      }

      var imageUrl = '/images/create?fromImage=' + payload.imageId;
      var containerUrl = '/containers/create?name=' + payload.name;
      
      //console.log('resources.js postContainer() imageUrl=' + imageUrl);
      //console.log('resources.js postContainer() containerUrl=' + containerUrl);
      
      
       var dockerStartJson = {};
      
        if (payload.imageId.indexOf("sp_proxy") > 0 || payload.name.indexOf("sp_proxy") > 0) {
          dockerStartJson = {
                "PortBindings": { "8888/tcp": [{ "HostPort": "80" }] },
                "Privileged": false,
                "PublishAllPorts": false
           }
        } 
      

      var callback = function(actions) {
          console.log('resources.js postContainer()->callback()');
          
          if (actions[0].statusCode != '201') {
              res.send(500, {message: 'error posting image to docker'});   
          } else if (actions[1].statusCode != '201') {
              res.send(500, {message: 'error posting container to docker'});   
          }
          var dockerReply =  JSON.parse(actions[1].response);
          console.log('resources.js postContainer() dockerReply=' + dockerReply);
          
          var startUrl = '/containers/' + dockerReply.Id + '/start';
          
          var innerCallback = function() {
               console.log('resources.js postContainer()->callback()->innerCallback()');
              res.send(201, {message: 'Container created', id: dockerReply.Id});   
          }
          
          var innerErrCallback = function(err) {
               console.log('resources.js postContainer()->callback()->innerErrCallback()');
              res.send(500, {message: err});  
          }
          
           msh.init(innerCallback, innerErrCallback)
           .post(dockerIp, dockerPort, startUrl, dockerStartJson)
           .pipe()
           .post(nucleusHost, nucleusPort, pokemonPath + '/record/' + dockerReply.Id)
           .end();

      }
      
      var errCallback = function(error) {
          console.log('resources.js postContainer()->errCallback()');
          res.send(500, {message: 'error 500'});   
      }
      
      var dockerPayload = transformer.muonToDocker(payload);
      console.log('resources.js postContainer() msh.init() dockerPayload=' + JSON.stringify(dockerPayload));
      
      msh.init(callback, errCallback)
      .post(dockerIp, dockerPort, imageUrl, {})
      .post(dockerIp, dockerPort, containerUrl, dockerPayload)
      .end();
        
  }
};





exports.deleteContainer = {
  'spec': {
    path : "/container/{containerId}",
    notes : "delete a container",
    summary : "Delete a containter",
    method: "DELETE",  
    nickname: "deleteContainer",
    parameters : [sw.pathParam("containerId", "Id of of containter to destroy", "string")],
    responseMessages : [swe.invalid('containerId'), swe.notFound('containter')]
  },
  'action': function (req,res) {
    console.log('resources.js deleteContainer()');
    if (! req.params.containerId) {
      throw swe.invalid('containerId'); 
    }
      
    var containerId = req.params.containerId;
  
      var killUrl = '/containers/' + containerId + '/kill';
      var deleteUrl = '/containers/' + containerId;
      
      /*

           def dockerRet = dockerApi.post("/containers/${id}/kill")
        dockerRet = dockerApi.delete("/containers/${id}")

        [message: "Container Destroyed"]
      */

      var cb = function(actions) {
          
          console.log('resources.js deleteContainer()->callback() actions:');
          //console.dir(actions);
          res.send(200, {message: "Container Destroyed"});
      }
      
      var cbe = function(err) {
          res.send(500, {message: err});
      }
      msh.init(cb, cbe)
      .post(dockerIp, dockerPort, killUrl)
      .del(dockerIp, dockerPort, deleteUrl)
      .del(nucleusHost, nucleusPort,  pokemonPath + '/record/' + containerId)
      .end();
    
  }
};


