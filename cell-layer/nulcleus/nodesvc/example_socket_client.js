var io = require('socket.io-client')

var socket = io.connect('http://localhost:7777');

socket.on('connect', function () {
    console.log("socket connected");
});

socket.on("gene-store/stateless", function(message) {
    console.log("Stateless service updated");
    console.dir(message);
});

socket.on("gene-store/riak", function(message) {
    console.log("Riak service updated");
    console.dir(message);
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


