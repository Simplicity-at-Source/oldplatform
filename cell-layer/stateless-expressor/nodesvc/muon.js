var io = require('socket.io-client')


var nucleusPort =  process.env.SP_NUCLEUS_PORT || 7777;
var nucleusHost =  process.env.SP_NUCLEUS_HOST || "localhost";
var globalNucleusUrl =  "http://" + nucleusHost + ":" + nucleusPort;

module.exports = function(overrideNucleus) {
    var nucleusUrl = globalNucleusUrl;

    if (overrideNucleus != null) {
        nucleusUrl = overrideNucleus;
    }
    console.log("Booting Muon Client Connection to " + nucleusUrl);

    var socket = io.connect(nucleusUrl);

    socket.on('connect', function () {
        console.log("muon socket connected");
    });
    socket.on('error', function () {
        console.log("balls ..");
    });
    socket.on('reconnect_failed', function () {
        console.log("reconnect_failed ..");
    });
    socket.on('disconnect', function () {
        console.log("disconnect ..");
    });

    socket.on('reconnecting', function () {
        console.log("reconnecting ..");
    });

    socket.on('reconnect_error', function (err) {
        console.log("reconnect_error ..");
        console.dir(err);
    });

    return {
        on:function(filter, callback) {
            //TODO, use the filter...

            //socket.emit("query", filter);
            socket.on("nucleus", function(ev) {
                console.log("Muon Client Received Message!");
                if (filter.hasOwnProperty("resource") && ev.resource != filter.resource) {
                    return false;
                }

                if (filter.hasOwnProperty("type") && ev.type != filter.type) {
                    return false;
                }
                if (filter.hasOwnProperty("recordId") && ev.recordId != filter.recordId) {
                    return false;
                }
                callback(ev);
            });
        },
        emit:function(event) {
            socket.emit("nucleus", event);
        },
        createResource : function(event) {
            event.action = "put";
            socket.emit("nucleus", event);
        },
        deleteResource : function(event) {
            event.action = "delete";
            socket.emit("nucleus", event);
        },
        shutdown:function() {
            socket.disconnect();
        },
        readNucleus:function(query, callback) {
            function listener(value) {
                socket.removeListener("resource", listener);
                callback(value)
            }
            socket.on("resource", listener);
            socket.emit("resource", query);
        },
        getIp: function() {
            return nucleusHost
        },
        getPort: function() {
            return nucleusPort
        }
    }
};

