
var callbacks = {};

exports.notify = function(msg) {
    for (var k in callbacks) {
        if (callbacks.hasOwnProperty(k)) {
            callbacks[k](msg);
        }
    }
};

exports.init= function (nucleus) {

    var io = require('socket.io').listen(7777);

    io.on('connection', function(socket){
        if (callbacks.hasOwnProperty(socket.id)) {
            console.log("Duplicate client detected, discarding reference.." + socket.id)
        } else {
            var theQuery = {};
            console.log('a remote component connected ' + socket.id);
            callbacks[socket.id] = function(msg) {
                if (messageMatchesQueryFilter(msg, theQuery)) {
                    socket.emit("nucleus", msg);
                }
            };

            socket.on('disconnect', function(){
                console.log('componnent disconnected ' + socket.id);
                delete callbacks[socket.id];
            });
            socket.on('query', function(query){
                console.log('Component ' + socket.id + 'registered a notification filter');
                console.dir(query);
                theQuery = query;
            });

            socket.on('resource', function(query){
                console.log('Component ' + socket.id + ' sent a resource query ');
                console.dir(query);
                //TODO, better querying . ...
                var ret = nucleus.getRecord(query.resource, query.type, query.recordId);
                socket.emit("resource", [ret]);
            });

            socket.on('nucleus', function(event){
                console.log('Component ' + socket.id + ' sent a message, possibly use to PUT/POST etc');
                console.dir(event);

                if (event.hasOwnProperty("action")) {
                    switch(event.action) {
                        case "put":
                            nucleus.putRecord(event.resource, event.type, event.recordId, event.payload);
                            break;
                        case "post":
                            nucleus.postRecord(event.resource, event.type, event.payload);
                            break;
                        case "delete":
                            nucleus.putRecord(event.resource, event.type, event.recordId);
                            break;
                    }
                }
            });
        }
    });
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
