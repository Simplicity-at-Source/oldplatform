http = require('http');
var restify = require('restify');

var port = process.env.PORT || 8080;
var debug = process.env.NODE_DEBUG || false;

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(port, function() {
    console.log('gene-store listening at %s', server.url);
});

var geneStore = {};

server.get('/', function(req, res) {
    console.log("gene-store GET /");
    //data = geneStore;
    res.send(geneStore);
});

server.get('/:type', function(req, res) {
    var type = req.params.type;
    console.log("gene-store GET /" + type);
    res.send(geneStore[type]);
});

server.post('/:type', function(req, res) {
    var type = req.params.type;
    console.log("gene-store POST /" + type);
    var payload = req.body;
    if ( geneStore[type] == undefined) {
        geneStore[type] = {};
    }
    geneStore[type][payload.id] = payload;
    data = {message: "gene-store post ok: stored payload with id=" + payload.id};
    res.send(data);
});

server.del('/:type', function(req, res) {
    var type = req.params.type;
    console.log("gene-store DEL /" + type);
    geneStore[type][payload.id] = {};
    data = {message: "gene-store, del ok"};
    res.send(data);
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