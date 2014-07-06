var io = require('socket.io-client')


var nucleusPort =  process.env.SP_NUCLEUS_PORT || 7777;
var nucleusHost =  process.env.SP_NUCLEUS_HOST || "localhost";
console.log("SP_NUCLEUS_HOST=" + process.env.SP_NUCLEUS_HOST);
console.log("SP_NUCLEUS_PORT=" + process.env.SP_NUCLEUS_PORT);

var globalNucleusUrl =  "http://" + nucleusHost + ":" + nucleusPort;

var callbacks = [];

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
    socket.on("nucleus", function(ev) {
        console.log("Muon Client Received Message!");
        for(var i = 0; i < callbacks.length; i++) {
            var c = callbacks[i];
            console.log("Checking the filter !");
            console.dir(c);
            if (messageMatchesQueryFilter(ev, c.filter)) {
                c.callback(ev);
            }
        }
    });

    return {
        on:function(filter, callback) {
            //socket.emit("query", filter);

            callbacks.push({
                filter:filter,
                callback:callback
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

function messageMatchesQueryFilter(message, filter) {

    if (filter.hasOwnProperty("resource") && message.resource != filter.resource) {
        return false;
    }

    if (filter.hasOwnProperty("type") && message.type != filter.type) {
        return false;
    }
    if (filter.hasOwnProperty("action") && message.action != filter.action) {
        return false;
    }
    if (filter.hasOwnProperty("recordId") && message.recordId != filter.recordId) {
        return false;
    }
    //todo, json query string.

    return true;
}

