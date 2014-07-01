
exports.muon = null;

exports.connect = function(host) {
    exports.muon = muon = require("./muon.js")(host);

    muon.on({
        resource: "stateless",
        type: "gene"}, function (event) {

        switch (event.action) {
            case "delete":
                console.log("Stateless resource deleted, finding /containers and nuking with prejudice");
                console.dir(event);

                muon.readNucleus({
                    resource:"container",
                    type:"gene",
                    query:""//TODO?
                }, function(containerGene) {
                    if(containerGene.hasOwnProperty("statelessService") &&   //this is a surrogate filter
                        containerGene.statelessService == event.recordId) {
                        console.log("Found a container matching deleted service " + containerGene.recordId);

                        muon.deleteResource({
                            resource:"container",
                            recordId:containerGene.recordId
                        });
                    }
                });
                break;
            case "put":
                console.log("Stateless Service resource created, starting spin up process");

                for(var i =0; i< event.payload.count; i++) {
                    //ask for as many containers as we need

                    var payload = new event.payload();

                    payload.statelessService = event.recordId;
                    delete payload.count;

                    muon.createResource({
                        resource:"container",
                        type:"gene",
                        recordId:event.recordId + "-" + i,
                        payload:payload
                    });
                }

                break;
            case "post":
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
                break;
            default:
                console.log("Received unknown service event from nucleus, ignoring");
                console.dir(event)
        }
    });
    console.log("Stateless Expressor is connected to Nucleus");
};


