
var callbacks = {};

exports.notify = function(msg) {
    for (var k in callbacks) {
        if (callbacks.hasOwnProperty(k)) {
            callbacks[k](msg);
        }
    }
};

exports.init= function (app) {

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
                //TODO, do the actualy querying . ...
                socket.emit("resource", []);
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
    //todo, json query string.

    return true;
}
