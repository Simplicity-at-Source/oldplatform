
exports.muon = null;

function createContainerPayload(event) {
    var payload = new event.payload();

    payload.statelessService = event.recordId;
    delete payload.count;
    return payload;
}

exports.connect = function(host) {
    exports.muon = muon = require("./muon.js")(host);

    muon.on({
        resource: "stateless",
        type: "gene",
        action:"put"
    }, function (event) {
        console.log("Stateless Service resource created, starting spin up process");

        for(var i =0; i< event.payload.count; i++) {
            //ask for as many containers as we need

            var payload = createContainerPayload(event);

            muon.createResource({
                resource:"container",
                type:"gene",
                recordId:event.recordId + "-" + i,
                payload:payload
            });
        }
    });

    muon.on({
        resource: "stateless",
        type: "gene",
        action:"delete"
    }, function (event) {

        console.log("Stateless resource deleted, finding /containers and nuking with prejudice");
        console.dir(event);

        muon.readNucleus({
            resource:"container",
            type:"gene",
            query:""//TODO?
        }, function(containerGene) {
            if(containerGene.hasOwnProperty("statelessService") &&   //this is a surrogate filter until it's implemented.
                containerGene.statelessService == event.recordId) {
                console.log("Found a container gene matching deleted service " + containerGene.recordId);

                muon.deleteResource({
                    resource:"container",
                    recordId:containerGene.recordId
                });
            }
        });
    });

    muon.on({
        resource: "stateless",
        type: "gene",
        action:"post"
    }, function (event) {
        //TODO, compare the essentials with the running service, destroy and recreate if needs be?
        //possiblyt an upgrade path here.
        //maybe just always run DELETE/ PUT?
        //image, ENV.
        console.log("Service mutation notified, IGNORING for now.");
        muon.emit({
            resource: "stateless",
            action: "post-ignore",
            recordId: event.recordId,
            payload: event.payload
        });
    });
    console.log("Stateless Expressor is connected to Nucleus");
};


