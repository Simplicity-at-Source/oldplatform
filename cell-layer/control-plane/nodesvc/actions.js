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

var dockerUrl = 'http://' + dockerIp + ':' + dockerPort;

var coreServices = {
    nucleus: {
        host:"",
        port:""
    }
};

exports.createAndStartDockerContainer = function (payload, muon) {

    //console.log('resources.js postContainer() imageUrl=' + imageUrl);
    //console.log('resources.js postContainer() containerUrl=' + containerUrl);

    var errCallback = function (error) {
        sendServerError(muon, {}, [], 'unknown error ' + err, 0);
    };

    var urlTemplate = function (lastHttpAction, queue) {
        return {
            dockerId: queue[0].response.Id
        };
    };

    muon.readNucleus({
        resource:"container",
        type:"gene",
        recordFilter:""
    }, function(pokemons) {

        var end = function (actions) {

            if (actions[0].statusCode != '201') {
                sendServerError(muon, actions[0], actions, 'error creating new container via docker api', 201);
                return;
            }

            if (actions[3] && actions[3].statusCode != '204') {
                sendServerError(muon, actions[3], actions, 'while starting docker container with id  ' + actions[0].response.Id, 204);
                return;
            }
            if (actions[5] && actions[5].statusCode != '200') {
                sendServerError(muon, actions[5], actions, 'while gettting started docker container json', 200);
                return;
            }

            console.log ("Updating nucleus with container runtime information for " + payload.recordId);
            muon.createResource({
                resource:"container",
                type:"runtime",
                recordId:payload.recordId,
                payload:actions[6]
            });
        };

        var dockerPayload = injectPlatformVariables(transformer.muonToDocker(payload));

        //var imageUrl = '/images/create?fromImage=' + payload.imageId;
        var containerUrl = '/containers/create?name=' + payload.name;

        msh.init(end, errCallback)
            //.post(dockerIp, dockerPort, imageUrl, {}) // not currently cerating the image
            .post(dockerIp, dockerPort, containerUrl, dockerPayload)
            .template(urlTemplate)
            .pipe()
            .post(dockerIp, dockerPort, '/containers/{dockerId}/start')
            .template(urlTemplate)
            .get(dockerIp, dockerPort, '/containers/{dockerId}/json')
            .pipe(createPokemonJson)
            .template(urlTemplate)
            .end();

    });
};

function sendServerError(muon, action, actions, message, expectedCode) {
    console.log("*********** UNEXPECTED ERROR: NON 200-300 HTTP STAUS CODE RETURNED **************************************");
    console.log("for action=%s %s %s", action.counter, action.method, action.path);
    console.log("expected %s but got %s", expectedCode, action.statusCode);
    console.log("message=" + message);
    console.log("action=" + JSON.stringify(action));
    console.dir(actions);
    console.log("*********** END UNEXPECTED ERROR ************************************************************************");

    //TODO, send a muon error message ...

    //res.send(500, {message: message, error: 'request error in action ' + action.counter, action: JSON.stringify(action) });
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

var createPokemonJson = function (dockerJson) {
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

exports.deleteContainer = function (containerId, callback) {
    console.log('deleteContainer()');
    if (!req.params.containerId) {
        throw swe.invalid('containerId');
    }
    var killUrl = '/containers/' + containerId + '/kill';
    var deleteUrl = '/containers/' + containerId;

    var successcallback = function (actions) {
        //TODO ... send a muon notification?
        callback({message: "Container Destroyed"});
    };

    var errCallback = function (err) {
        callback({message: err});
    };

    msh.init(callback, errCallback)
        .post(dockerIp, dockerPort, killUrl)
        .del(dockerIp, dockerPort, deleteUrl)
        .end();
};
