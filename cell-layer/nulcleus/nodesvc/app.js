http = require('http');
var restify = require('restify');
var _ = require('underscore');
var url = require('url');
var agent = require('superagent');

var port = process.env.PORT || 8080;
var debug = process.env.NODE_DEBUG || false;

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(port, function() {
    console.log('nucleus listening at %s', server.url);
});

var nucleusStore = {};

var callbackMappings = {"/foobar": [{method: "GET", url: "http://localhost:18080", payload: {message: "hi"}}] };


server.get('/', function(req, res) {
    doCallbacks(req);
    console.log("nucleus GET /");
    //data = nucleusStore;
    res.send(nucleusStore);
});

server.get('/:storeName', function(req, res) {
    doCallbacks(req);
    var storeName = req.params.storeName;
    console.log("nucleus GET /" + storeName);
    if (nucleusStore[storeName]) {
        console.dir(nucleusStore[storeName]);
        var results = [];
        for (var key in nucleusStore[storeName]) {
            results.push(nucleusStore[storeName][key]);
        }
        res.send(results);
    } else {
        res.send(404, {status: 404});
    }

});

server.get('/:storeName/:subStoreName', function(req, res) {
    doCallbacks(req);
    var storeName = req.params.storeName;
    var subStoreName = req.params.subStoreName;
    console.log("nucleus GET  /" + storeName + "/" + subStoreName );

    var data  = nucleusStore[storeName][subStoreName];

    console.log("returning service data: " + data);
    if (data) {
        res.send(data);
    } else {
        res.send(404, {status: 404});
    }

});


server.get('/:storeName/:subStoreName/:id', function(req, res) {
    doCallbacks(req);
    var storeName = req.params.storeName;
    var subStoreName = req.params.subStoreName;
    var id = req.params.id;
    console.log("nucleus GET  /" + storeName + "/" + subStoreName + "/" + id );

    var data  = nucleusStore[storeName][subStoreName][id];

    console.log("returning subStore data: " + JSON.stringify(data));
    if (data) {
        res.send(data);
    } else {
        res.send(404, {status: 404});
    }

});

server.post('/callback', function(req, res) {
    var body = req.body;
    console.log("POST /callback body=" + JSON.stringify(body));
    var callbackOpts = {method: body.method, url: body.url, payload: body.payload};
    if (! callbackMappings[body.path]) {
        callbackMappings[body.path] = [callbackOpts];
    } else {
        callbackMappings[body.path].push(callbackOpts);
    }
    res.send(204);
});

server.post('/:storeName/:subStoreName', function(req, res) {
    doCallbacks(req);
    var storeName = req.params.storeName;
    var subStoreName = req.params.subStoreName;

    console.log("nucleus POST /" + storeName + "/" + subStoreName );
    var payload = req.body;
    if ( nucleusStore.storeName == undefined) {
        nucleusStore.storeName = {};
    }
    if ( nucleusStore.storeName.subStoreName == undefined) {
        nucleusStore.storeName.subStoreName = {};
    }
    nucleusStore.storeName.subStoreName[payload.id] = payload;
    data = {message: "nucleus post ok: stored payload with id=" + id};
    res.send(data);
});


server.put('/:storeName/:subStoreName/:id', function(req, res) {
    doCallbacks(req);
    var storeName = req.params.storeName;
    var subStoreName = req.params.subStoreName;
    var id = req.params.id;
    console.log("nucleus PUT /" + storeName + "/" + subStoreName + "/" + id);
    var payload = req.body;
    if ( nucleusStore[storeName] == undefined) {
        nucleusStore[storeName] = {};
    }
    if ( nucleusStore[storeName][subStoreName] == undefined) {
        nucleusStore[storeName][subStoreName] = {};
    }
    nucleusStore[storeName][subStoreName][id] = payload;
    data = {message: "nucleus PUT ok: stored payload with id=" + id};
    console.log("nucleusStore: " + JSON.stringify(nucleusStore));
    res.send(data);
});

server.del('/:storeName/:subStoreName/:id', function(req, res) {
    doCallbacks(req);
    console.log("nucleus DEL store=" + JSON.stringify(nucleusStore));
    var storeName = req.params.storeName;
    var subStoreName = req.params.subStoreName;
    var id = req.params.id;
    console.log("nucleus DEL  /" + storeName + "/" + subStoreName + "/" + id);
    nucleusStore[storeName][subStoreName][id] = undefined;
    console.log("nucleus DEL store=" + JSON.stringify(nucleusStore));
    data = {message: "nucleus, del ok"};
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

function doCallbacks(req) {
    var path = url.parse(req.url, true, false).path;
    console.log("nucleus doCallbacks() path=" + path);
    var callbacks = callbackMappings[path];

    var iterator = function(element, index, list) {
        var callback = function(res) {
            console.log("callback response from " + element.url + ": " + res.status);
        };
        console.log("nucleus performing callback to " + element.url);
        agent.get(element.url).end(callback);
    };

    _.each(callbacks, iterator );

}