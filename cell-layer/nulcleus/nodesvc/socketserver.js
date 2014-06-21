
var callbacks = {};

exports.notify = function(msg) {
    for (var k in callbacks) {
        if (callbacks.hasOwnProperty(k)) {
            console.log("Notifying " + k);
            //TODO, add predicates.
            callbacks[k](msg);
        }
    }
};

exports.init= function (app) {
//    var http = require('http').Server(app);
//    var io = require('socket.io')(http);

      var io = require('socket.io').listen(7777);

    io.set('transports', [
        'websocket'
    ]);

    io.on('connection', function(socket){
        console.log('a user connected');
        console.dir(socket.transport);
        callbacks[socket.client.id] = function(msg) {
            socket.emit('nucleus', msg);
        };

        socket.on('disconnect', function(){
            console.log('user disconnected');
            delete callbacks[socket.client.id];
        });
    });
    //return http;
};
