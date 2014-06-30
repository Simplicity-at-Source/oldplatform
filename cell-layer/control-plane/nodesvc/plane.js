
exports.muon = null;

exports.connect = function(host) {
    exports.muon = muon = require("./muon.js")(host);
    var controlPlane = require("./actions.js");

    controlPlane.loadCoreServices(muon, function(records) {
        muon.on({
            resource: "container",
            type: "gene"}, function (event) {

            switch (event.action) {
                case "delete":
                    console.log("Container resource deleted, finding in docker and nuking with prejudice");
                    console.dir(event);
                    controlPlane.deleteContainer(event.recordId, function () {
                        muon.emit({
                            resource: "container",
                            action: "deleted",
                            recordId: event.recordId
                        });
                    });
                    break;
                case "put":
                    console.log("Container resource created, starting spin up process");
                    controlPlane.createAndStartDockerContainer(event, muon);
                    break;
                case "post":
                    //TODO, compare the essentials with the running container, destroy and recreate if needs be?
                    //maybe just always run DELETE/ PUT?
                    //image, ENV.
                    console.log("Container mutation notified, IGNORING for now.");
                    muon.emit({
                        resource: "container",
                        action: "post-ignore",
                        recordId: event.recordId,
                        payload: event.payload
                    });
                    break;
                default:
                    console.log("Received unknown container event from nucleus, ignoring");
                    console.dir(event)
            }
        });
        console.log("Control Plane is connected to Nucleus");
    });

    //TODO, react to docker events as well ...
    //TODO, do housekeeping every so often to keep containers in sync with genes?

};


