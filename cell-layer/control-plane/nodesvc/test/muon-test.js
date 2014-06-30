
var io = null

exports.listen = function(port) {

    io = require('socket.io').listen(port);

    io.on('connection', function(socket){
        if (callbacks.hasOwnProperty(socket.id)) {
            console.log("Duplicate client detected, discarding reference.." + socket.id)
        } else {
            var theQuery = {};
            console.log('a remote component connected to the test nucleus' + socket.id);
            socket.on('disconnect', function(){
                console.log('component disconnected ' + socket.id);
                delete callbacks[socket.id];
            });
            socket.on('query', function(query){
                console.log('Component ' + socket.id + 'registered a notification filter');
                console.dir(query);
                theQuery = query;
            });
        }
    });
};

exports.send = function(message) {
    io.sockets.emit('nucleus', message);
};

exports.on = function(call) {
    socket.on("nucleus", call);
};

exports.onResourceQuery = function(expectedQuery, response) {
    socket.on("nucleus", call);
};
