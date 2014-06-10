http = require('http');
var restify = require('restify');
var url = require('url');
var CronJob = require('cron').CronJob;

var port = process.env.PORT || 8080;
var debug = process.env.NODE_DEBUG || false;

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(port, function() {
    console.log('cron listening at %s', server.url);
});

var cronStore = {};

server.get('/', function(req, res) {
    console.log("cron GET /");
    res.send(cronStore);
});

server.get('/:storeName/', function(req, res) {
    var storeName = req.params.storeName;
    //if()
    console.log("cron GET /:storeName", cronStore[storeName]);
    res.send(cronStore[storeName] || 404);
});

server.get('/:storeName/:id/', function(req, res) {
    var storeName = req.params.storeName;
    var id = req.params.id;
    console.log("cron GET /:storeName/:id/");
    res.send(cronStore[storeName][id] || 404);
});

server.put('/:storeName/:id/', function(req, res) {
    var storeName = req.params.storeName;
    //console.log("json=" + req.body.cronTime);
    
    var id = req.params.id;
    console.log("cron PUT /" + storeName + "/" + id);
    var payload = req.body;
    if ( cronStore[storeName] == undefined) {
        cronStore[storeName] = {};
    }
    cronStore[storeName][id] = payload;
    new CronJob(req.body.cronTime, function(){
        console.log('MESSAGE');
    }, null, true);
    data = {message: "cron PUT ok: stored payload with id=" + id};
    console.log("cronStore: " + JSON.stringify(cronStore));
    res.send(data);
});
/*
server.del('/:storeName/', function(req, res) {
    //doCallbacks(req);
    console.log("cron DEL store=" + JSON.stringify(cronStore));
    var storeName = req.params.storeName;
    var id = req.params.id;
    console.log("cron DEL  /" + storeName);
    cronStore[storeName] = undefined;
    console.log("cron DEL store=" + JSON.stringify(cronStore));
    data = {message: "cron, del ok"};
    res.send(data);
});
*/
server.del('/:storeName/:id/', function(req, res) {
    //doCallbacks(req);
    console.log("cron DEL store=" + JSON.stringify(cronStore));
    var storeName = req.params.storeName;
    var id = req.params.id;
    console.log("cron DEL  /" + storeName + "/" + id);
    cronStore[storeName][id] = undefined;
    console.log("cron DEL store=" + JSON.stringify(cronStore));
    data = {message: "cron, del ok"};
    res.send(data);
});