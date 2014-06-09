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

server.put('/:storeName/:id', function(req, res) {
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