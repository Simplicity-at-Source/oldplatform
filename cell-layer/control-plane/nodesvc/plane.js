
var muon = require("./muon.js");
var controlPlane = require("./actions.js");

muon.on({
    resource:"container",
    type:"gene"}, function(event) {

    switch(event.type) {
        case "DELETE":
            console.log("Container resource deleted, finding in docker and nuking with prejudice");
            controlPlane.deleteContainer(event.recordId, new function() {
                muon.emit({
                    resource:"container",
                    action:"deleted",
                    recordId:event.recordId
                });
            });
            break;
        case "PUT":
            console.log("Container resource created, starting spin up process");
            controlPlane.createAndStartDockerContainer(event, muon);
            break;
        case "POST":
            //TODO, compare the essentials with the running container, destroy and recreate if needs be?
            //maybe just always run DELETE/ PUT
            //image, ENV.
            console.log("Container mutation notified, IGNORING for now.");
            muon.emit({
                resource:"container",
                action:"post-ignore",
                recordId:event.recordId,
                payload:event.payload
            });
            break;
        default:
            console.log("Received unknown container event from nucleus, ignoring");
            console.dir(event)
    }

//    //just an example of reading data from nucleus
//    muon.readNucleus("/pokemon/something?", function(pokemons) {
//
//    });
});

//TODO, docker events as well ...
