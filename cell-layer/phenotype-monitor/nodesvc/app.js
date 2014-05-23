http = require('http');
var restify = require('restify');

var port = process.env.PORT || 8080;
var debug = process.env.NODE_DEBUG || false;

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(port, function() {
    console.log('phen mon listening at %s', server.url);
});

var status = {};

server.get('/', function(req, res) {
    console.log("phen mon GET /");

    res.send(status);
});

server.post('/', function(req, res) {
    console.log("phen mon POST /");
    var payload = req.body;
    //messages.push(payload);
    status = payload;
    res.send({message: "Thank you"});
});


if (debug == "true") {
    console.log("debug=" + debug);
    server.on('uncaughtException', function(req, res, route, err) {
            console.log("uncaughtException err: " + err.message);
            //console.dir(dir);
            console.log(err.stack);
            res.send(err);
        }
    );
}