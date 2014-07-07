
var plane = require("./plane.js");

console.log("Starting Control Plane");

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
});

plane.connect();
