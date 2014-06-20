var sw = require("swagger-node-express");
var url = require("url");
var swe = sw.errors;



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
        res.send(JSON.stringify({message: "/containers"}));
  }
};