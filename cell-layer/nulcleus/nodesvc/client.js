var io = require('socket.io-client')

//io.set()

var socket = io.connect('http://localhost:3000');

socket.on('connect', function () {
    console.log("socket connected");

    socket.emit('private message', { user: 'me', msg: 'whazzzup?' });

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


