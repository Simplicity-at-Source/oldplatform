var sw = require("swagger-node-express");
var url = require("url");
var msh = require('msh');
var request = require("superagent");
var transformer = require('./payloadTransformer.js');
var assert = require('assert');

var swe = sw.errors;

var dockerPort = process.env.SP_DOCKER_PORT || 4321;
var dockerIp = process.env.SP_DOCKER_HOST || '172.17.42.1';
var nucleusPort = process.env.SP_NUCLEUS_PORT;
var nucleusHost = process.env.SP_NUCLEUS_HOST;

var dockerUrl = 'http://' + dockerIp + ':' + dockerPort;
var nucleusUrl = 'http://' + nucleusHost + ':' + nucleusPort;

var nucleusUp = false;


var pokemonPath = '/service/pokemon/substore/muon'


var coreServices = {};


console.log("********** nucleusUrl=" + nucleusUrl);
console.log("********** nucleusUrl=" + dockerUrl);


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
      
    createAndStartDockerContainer(req, res, payload);
        
  }
};



function createAndStartDockerContainer(req, res, payload)  {
     

      var imageUrl = '/images/create?fromImage=' + payload.imageId;
      var containerUrl = '/containers/create?name=' + payload.name;
      
      //console.log('resources.js postContainer() imageUrl=' + imageUrl);
      //console.log('resources.js postContainer() containerUrl=' + containerUrl);

      var callback = function(actions) {
          //console.log('resources.js postContainer()->callback()');
          // after we've created the docker container and get it's ID, we can start the container

          //if (actions[0].statusCode != '201') {
        //         sendServerError(res, actions[0], actions, 'error creating new image via docker api'  );    
        //  } 
          if (actions[0].statusCode != '201') {
              sendServerError(res, actions[0], actions, 'error creating new container via docker api'  , 201);    
          } 
          else if (! actions.allOk() ) {
              res.send(500, {message: 'error during msh callbacks', logs: actions});    
          }
          var dockerReply =  actions[0].response;
          //console.log('resources.js postContainer() dockerReply=' + dockerReply);
          
          startContainer(req, res, dockerReply, payload);
      }
      
      var errCallback = function(error) {
          sendServerError(res, {}, [], 'unknown error ' + err , 0);
      }
      
      var dockerPayload = transformer.muonToDocker(payload);
      //console.log('resources.js postContainer() msh.init() dockerPayload=' + JSON.stringify(dockerPayload));
      
      msh.init(callback, errCallback)
      //.post(dockerIp, dockerPort, imageUrl, {})
      .post(dockerIp, dockerPort, containerUrl, injectPlatformVariables(dockerPayload))
      .end();
}



function sendServerError(res, action, actions, message, expectedCode) {
    console.log("*********** UNEXPECTED ERROR: NON 200-300 HTTP STAUS CODE RETURNED **************************************");
     console.log("for action=%s %s %s", action.counter, action.method, action.path);
     console.log("expected %s but got %s", expectedCode, action.statusCode);
    console.log("message=" + message);
    console.log("action=" + JSON.stringify(action));
    console.dir(actions);
    console.log("*********** END UNEXPECTED ERROR ************************************************************************");
    res.send(500, {message: message, error: 'request error in action ' + action.counter, action: JSON.stringify(action) });   
}

function startContainer(req, res, dockerReply, payload)  {
    
    
     //if (payload.name.indexOf('nucleus') > -1) {
     //         console.log("******************** nucleus container created, setting nucleusUp=true");
      //        nucleusUp = true;
       //   }
    
     var dockerStartJson =  createDockerStartJson(dockerStartJson, payload);

      var startUrl = '/containers/' + dockerReply.Id + '/start';

      var callback = function(actions) {
         console.log('*********************************************************************************');
           console.log('resources.js postContainer()->callback() actions:');
           //console.log('payload=' + JSON.stringify(payload));
          // console.log('dockerStartJson=' + JSON.stringify(dockerStartJson));
          console.dir(actions);
          //console.log("actions[0].statusCode=" + actions[0].statusCode);
          
          
          
          if (actions[0] && actions[0].statusCode != '204') {
              sendServerError(res, actions[0], actions, 'while starting docker container with id  ' +  dockerReply.Id, 204);  
              return;
          } 
          if (actions[1] && actions[1].statusCode != '200') {
               sendServerError(res, actions[1], actions, 'while gettting started docker container json', 200 );
              return;
          }
          if (actions[3] && actions[3].statusCode != '201') {
               console.log("********** WARNING: PROBLEM ATTEMPTING TO PUT TO NUCLEUS action=" + JSON.stringify(actions[3]));
              res.send(201, {message: 'Container created', id: dockerReply.Id});
              return;
          }
          
        logCoreServices(actions[1].response);
          
          res.send(201, {message: 'Container created', id: dockerReply.Id});   
          
          
      }

      var errCallback = function(err) {
           //console.log('resources.js postContainer()->callback()->innerErrCallback()');
          sendServerError(res, {}, [], 'unknown error ' + err , 0);
      }
      
      
      if (nucleusUp) {
            msh.init(callback, errCallback)
           .post(dockerIp, dockerPort, startUrl, dockerStartJson)
           .get(dockerIp, dockerPort, '/containers/' + dockerReply.Id + '/json')
           .pipe(createPokemonJson)
           .put(nucleusHost, nucleusPort, pokemonPath + '/record/' + dockerReply.Id)
           .end();
      } else {
            console.log("********** Nucleus Down Not PUTing container info to nucleus **********");
            msh.init(callback, errCallback)
           .post(dockerIp, dockerPort, startUrl, dockerStartJson)
            .get(dockerIp, dockerPort, '/containers/' + dockerReply.Id + '/json')
           .end();
      }

}


function logCoreServices(dockerPayload) {
    
     console.log('********************************************************** resources.js logCoreServices() ****************************************************************************************');
    console.log('resources.js logCoreServices() dockerPayload=' + JSON.stringify(dockerPayload));
     console.log('resources.js logCoreServices() coreServices=' + JSON.stringify(coreServices));
    var host;
    var port;
    var service = undefined;
    
     if (dockerPayload.Name.indexOf('nucleus') > -1) {
          service = 'nucleus';
          nucleusUp = true;
      } else if (dockerPayload.Name.indexOf('proxy') > -1) {
          service = 'proxy';
      } else if (dockerPayload.Name.indexOf('gns') > -1) {
          service = 'gns';
      } 
    
    if (service) {
         console.log("******************** %s core service container created. Setting up coreServices object with host/port data", service); 
         coreServices[service] = {};
        coreServices[service].id = dockerPayload.Id;
        coreServices[service].service = service;
         coreServices[service].host = dockerPayload.NetworkSettings.IPAddress;
         coreServices[service].port = 8080;
    }
    
}
function injectPlatformVariables(dockerPayload) {
   console.log('********************************************************** resources.js injectPlatformVariables() ****************************************************************************************');
    console.log('resources.js injectPlatformVariables() dockerPayload=' + JSON.stringify(dockerPayload));
     console.log('resources.js injectPlatformVariables() coreServices=' + JSON.stringify(coreServices));
    
    if (coreServices.nucleus) {
        console.log('******************** injectPlatformVariables() enriching with nucleus data');  
       dockerPayload.Env.push("MUON_NUCLEUS_IP=" + coreServices.nucleus.host);
       dockerPayload.Env.push("MUON_NUCLEUS_PORT=" + coreServices.nucleus.port);
    }
    if (coreServices.gns) {
         console.log('******************** injectPlatformVariables() enriching with gns data');  
       dockerPayload.Env.push("MUON_GNS_IP=" + coreServices.gns.host);
       dockerPayload.Env.push("MUON_GNS_PORT=" + coreServices.gns.port);
    }
    if (coreServices.proxy) {
         console.log('******************** injectPlatformVariables() enriching with proxy data');  
       dockerPayload.Env.push("MUON_GNS_IP=" + coreServices.proxy.host);
       dockerPayload.Env.push("MUON_GNS_PORT=" + coreServices.proxy.port);
    }    
      
     console.log('******************** resources.js END injectPlatformVariables() dockerPayload=' + JSON.stringify(dockerPayload));
    return dockerPayload;
}

var  createPokemonJson = function(dockerJson) {
    console.log("transforming docker response to nucleus payload");
    var id = dockerJson.Id
    /*
     it.id = it.Id
      it.inspection = dockerApi.get("/containers/${it.Id}/json")
      it.provides = generateProvides(it.inspection)
    */
    return {
        id: id,
        inspection: dockerJson,
        provides: 'TBC..' //generateProvides(dockerJson)
    };
    
}

function generateProvides(dockerJson) {
        /*
        def provides = containerInspection.Config?.Env?.find {
          it.startsWith("PROVIDES")
        }

        if (!provides) {
          return []
        }

        def provisions = provides.substring(9)?.split(",")

        return provisions.collect {
          def (name, port) = it.split(":")
          [name: name, port: port]
        }
      }
        */
    
    var  provides = _.find(dockerJson.Config.Env, function(element) {
        element.indexOf('PROVIDES') > -1;
    });
    
    var provisions = provides.substring(9).split(",");
    //errrw wtf now?.....
    var result = _.each();
    
}


function createDockerStartJson(dockerStartJson, payload) {
      var dockerStartJson = {};

    // Expose proxy on port 80 if this is the sp_proxy container being created
        if (payload.imageId.indexOf("sp_proxy") > 0 || payload.name.indexOf("sp_proxy") > 0) {
          dockerStartJson = {
                "PortBindings": { "8888/tcp": [{ "HostPort": "80" }] },
                "Privileged": false,
                "PublishAllPorts": false
           }
        } 
        return dockerStartJson;
}





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
        deleteContainer(req, res, containerId);
    
  }
};



function deleteContainer(req, res, containerId) {
      var killUrl = '/containers/' + containerId + '/kill';
      var deleteUrl = '/containers/' + containerId;
      
      /*
        def dockerRet = dockerApi.post("/containers/${id}/kill")
        dockerRet = dockerApi.delete("/containers/${id}")

        [message: "Container Destroyed"]
      */

      var callback = function(actions) {
          //console.log('resources.js deleteContainer()->callback() actions:');
          //console.dir(actions);
          res.send(200, {message: "Container Destroyed"});
      }
      
      var errCallback = function(err) {
          res.send(500, {message: err});
      }
      
      msh.init(callback, errCallback)
      .post(dockerIp, dockerPort, killUrl)
      .del(dockerIp, dockerPort, deleteUrl)
      .del(nucleusHost, nucleusPort,  pokemonPath + '/record/' + containerId)
      .end();
}

