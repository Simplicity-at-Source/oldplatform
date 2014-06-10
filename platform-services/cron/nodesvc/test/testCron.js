var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8080';

var postData = {"id":"myID", "url":"http:somehost:8080/call/me/here/path", "cronTime":"*/10 * * * * *", "desc":"my cron callback", "serviceName":"myService"};

describe('test cron: ', function(){

    it('/ works ok', function(done){
        var req = request.get(host + '/');
        req.end(function(res){
            console.log("/ res: " + res.text);
            var json = JSON.parse(res.text);
            assert.equal(200, res.status);
            done();
        });
    });
/*
    it('/cron works ok', function(done){
        var req = request.get(host + '/gene-store');
        req.end(function(res){
            console.log("/ res: " + res.text);
            var json = JSON.parse(res.text);
            assert.equal(404, res.status);
            done();
        });
    });
*/
    it('create and get new cron job', function(done){
        var req = request.put(host + '/myService/' + postData.id);
        //req.set('Content-Type', 'application/json');
        req.send( postData );
        req.end(function(res){
            console.log("it(put cron) response: ");
            console.dir(res.body);
            //var jsonRes = JSON.parse(res.body);
            assert.equal(200, res.status);
            //assert.ok(contains( jsonRes.status, "ok"));
/*
            var req = request.get(host + '/gene-store/cell/sentiment');
            req.end(function(res){
                console.log("it(post,get /gene-store/cell/sentiment) res: " + res.text);
                var jsonRes = JSON.parse(res.text);
                //console.dir(jsonRes.sentiment);
                assert.equal(200, res.status);
                assert.equal('sentiment', jsonRes.id)
            });
*/
            var req = request.get(host + '/myService/myID');
            req.end(function(res){
                console.log("it(put, get /myService/myID/) res: " + res.text);
                var jsonRes = JSON.parse(res.text);
                //console.dir(jsonRes.body.cronTime);
                assert.equal(200, res.status);
                //assert.equal('sentiment', jsonRes.sentiment.id)
                done();
            });

        });
    });

    it('delete cron job', function(done){
        
        var req = request.put(host + '/myService/' + postData.id);
        //req.set('Content-Type', 'application/json');
        req.send( postData );
        req.end(function(res){
            var req = request.del(host + '/myService/myID');
            req.end(function(res){
                console.log("it(del cron) response: ");
                console.dir(res.body);
                //var jsonRes = JSON.parse(res.body);
                assert.equal(200, res.status);
                //assert.ok(contains( jsonRes.status, "ok"));

                var req = request.get(host + '/myService/myID');
                req.end(function(res){
                    console.log("it(del, get service cron jobs) res: " + res.text);
                    //var jsonRes = JSON.parse(res.text);
                    //console.dir(jsonRes.sentiment);
                    assert.equal(404, res.status);
                    done();
                });
            });
        });
    });

/*
    it('gene-store callsback to test service', function(done){


        function httpStartupComplete(service, port) {
            console.log("starting %s service on port %s", service, port);
        }


        var requestHandler = function(req, res) {
            console.log("MockCallbackee called ");
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({}));
            res.end();
            done();
        };
        http.createServer(requestHandler).listen(18081, httpStartupComplete("mockCallbackService", 18081));

        var callbackPayload = {path: "/", method: "GET", url: "http://localhost:18081/blah", payload: {} };

        var req = request.post(host + '/callback');
        req.send(callbackPayload);
        req.end(function(res){
            console.log("it(post /callback) response: ");
            //console.dir(res.body);
            //var jsonRes = JSON.parse(res.body);
            assert.equal(204, res.status);
            //assert.ok(contains( jsonRes.status, "ok"));

            var req = request.get(host + '/');
            req.end(function(res){
                console.log("it(post /callback, get /) res: " + res.text);
                var jsonRes = JSON.parse(res.text);
                console.dir(jsonRes.sentiment);
                assert.equal(200, res.status);
            });

        });
    });
    
    */
});
