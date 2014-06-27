var sw = require("swagger-node-express");
var url = require("url");
var msh = require('msh');
var request = require("superagent");
var transformer = require('./payloadTransformer.js');
var assert = require('assert');

var swe = sw.errors;

/*

"DNSHOST=riak_node.dev.muon.io",
"MUON_DOMAIN=dev.muon.io",
"MUON_CONTROL_PLANE_IP=172.17.0.2",
"MUON_NUCLEUS_IP=172.17.0.4",
"MUON_NUCLEUS_PORT=8080",
"MUON_GNS_IP=172.17.0.5",
"MUON_GNS_PORT=8080",
"MUON_GNS_IP=172.17.0.3",
"MUON_GNS_PORT=8080",

*/


var muonDomain = process.env.MUON_DOMAIN || '.';

var dockerPort = process.env.SP_DOCKER_PORT || 4321;
var dockerIp = process.env.SP_DOCKER_HOST || '172.17.42.1';
var nucleusPort = process.env.MUON_NUCLEUS_PORT || undefined;
var nucleusHost = process.env.MUON_NUCLEUS_IP || undefined;

var dockerUrl = 'http://' + dockerIp + ':' + dockerPort;
var nucleusUrl = 'http://' + nucleusHost + ':' + nucleusPort;

var nucleusUp = false;


var pokemonPath = '/service/pokemon/substore/muon'


var coreServices = {};


console.log("********** MUON_DOMAIN=" + muonDomain);
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
    
    console.log('\nresources.js postContainer() req.body=' + JSON.stringify(req.body));
    var payload = req.body;

      if (! payload) {
           throw swe.invalid('payload'); 
      }
      
    createAndStartDockerContainer(req, res, payload);
        
  }
};
















function createAndStartDockerContainer(req, res, payload)  {

      //console.log('resources.js postContainer() imageUrl=' + imageUrl);
      //console.log('resources.js postContainer() containerUrl=' + containerUrl);

     var errCallback = function(error) {
          sendServerError(res, {}, [], 'unknown error ' + err , 0);
      }

    
        var stopPredicate = function() {
              if (nucleusUp) { return false; }
                return true;
        }

        var urlTemplate = function(lastHttpAction, queue) {
            var template =  {
                dockerId: queue[0].response.Id,
            };
            //console.log("urlTemplate: " + JSON.stringify(template));
            return template;
        }
        
        var geneToDockerTransformer = function(dockerStartJson) {
             var result =  createDockerStartJson(dockerStartJson, payload);
            return result;
        }

      var callback = function(actions) {
          //console.log('resources.js postContainer()->callback()');
          
          if (actions[0].statusCode != '201') {
              sendServerError(res, actions[0], actions, 'error creating new container via docker api'  , 201);  
              return;
          } 
          //else if (! actions.allOk() ) {
        //      res.send(500, {message: 'error during msh callbacks', logs: actions});    
        //  }
          
          if (actions[3] && actions[3].statusCode != '204') {
              sendServerError(res, actions[3], actions, 'while starting docker container with id  ' +  actions[0].response.Id, 204);  
              return;
          } 
          if (actions[5] && actions[5].statusCode != '200') {
               sendServerError(res, actions[5], actions, 'while gettting started docker container json', 200 );
              return;
          }
          if (actions[9] && actions[9].statusCode != '201') {
               //console.log("********** WARNING: PROBLEM ATTEMPTING TO PUT TO NUCLEUS action=" + JSON.stringify(actions[3]));
          } 
              
                  logCoreServices(actions[5].response);
                res.send(201, {message: 'Container created', id: actions[5].response.Id}); 
          
      }

      var dockerPayload = injectPlatformVariables(transformer.muonToDocker(payload));

      var imageUrl = '/images/create?fromImage=' + payload.imageId;
      var containerUrl = '/containers/create?name=' + payload.name;
      
      msh.init(callback, errCallback)
      //.post(dockerIp, dockerPort, imageUrl, {}) // not currently cerating the image
      .post(dockerIp, dockerPort, containerUrl, dockerPayload)
      .template(urlTemplate) 
      .pipe()
      .post(dockerIp, dockerPort, '/containers/{dockerId}/start')
      .template(urlTemplate) 
      .get(dockerIp, dockerPort, '/containers/{dockerId}/json')
      .stop(stopPredicate)
      .pipe(createPokemonJson)
      .template(urlTemplate) 
      .put(nucleusHost, nucleusPort, pokemonPath + '/record/{dockerId}')
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



function logCoreServices(dockerPayload) {
    
    // console.log('*************** resources.js logCoreServices() ****************');
    //console.log('resources.js logCoreServices() dockerPayload=' + JSON.stringify(dockerPayload));
    // console.log('resources.js logCoreServices() coreServices=' + JSON.stringify(coreServices));
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
        // console.log("******************** %s core service container created. Setting up coreServices object with host/port data", service); 
         coreServices[service] = {};
        coreServices[service].id = dockerPayload.Id;
        coreServices[service].service = service;
         coreServices[service].host = dockerPayload.NetworkSettings.IPAddress;
         coreServices[service].port = 8080;
    }
    
    if (nucleusUp && ! nucleusPort && ! nucleusHost) {
     nucleusPort = coreServices.nucleus.port;
     nucleusHost = coreServices.nucleus.host;
    }
    
}
function injectPlatformVariables(dockerPayload) {
  // console.log('********** resources.js injectPlatformVariables() *******************');
  //  console.log('resources.js injectPlatformVariables() dockerPayload=' + JSON.stringify(dockerPayload));
  //   console.log('resources.js injectPlatformVariables() coreServices=' + JSON.stringify(coreServices));
    
    if (coreServices.nucleus) {
       // console.log('********** injectPlatformVariables() enriching with nucleus data');  
       dockerPayload.Env.push("MUON_NUCLEUS_IP=" + coreServices.nucleus.host);
       dockerPayload.Env.push("MUON_NUCLEUS_PORT=" + coreServices.nucleus.port);
    }
    if (coreServices.gns) {
       //  console.log('********** injectPlatformVariables() enriching with gns data');  
       dockerPayload.Env.push("MUON_GNS_IP=" + coreServices.gns.host);
       dockerPayload.Env.push("MUON_GNS_PORT=" + coreServices.gns.port);
    }
    if (coreServices.proxy) {
         console.log('********** injectPlatformVariables() enriching with proxy data');  
       dockerPayload.Env.push("MUON_GNS_IP=" + coreServices.proxy.host);
       dockerPayload.Env.push("MUON_GNS_PORT=" + coreServices.proxy.port);
    }   
    
    
    dockerPayload.Env.push("MUON_DOMAIN=" + muonDomain);
    
      
    // console.log('********** resources.js END injectPlatformVariables() dockerPayload=' + JSON.stringify(dockerPayload));
    return dockerPayload;
}

var  createPokemonJson = function(dockerJson) {
    //console.log("transforming docker response to nucleus payload");
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

