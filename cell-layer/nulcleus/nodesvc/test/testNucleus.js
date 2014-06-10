var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8080';
var http = require('http');



var postData = {"id":"sentiment","image":"sp_platform/uber-any","env":{"GIT_REPO_URL":"https://github.com/fuzzy-logic/sentiment.git"}};

describe('test gene-store: ', function(){

    it('/ works ok', function(done){
        var req = request.get(host + '/');
        req.end(function(res){
            console.log("/ res: " + res.text);
            var json = res.text;
            assert.equal(200, res.status);
            done();
        });
    });

    it('/gene-store works ok', function(done){
        var req = request.get(host + '/service/gene-store');
        req.end(function(res){
            console.log("/ res: " + res.text);
            var json = JSON.parse(res.text);
            assert.equal(404, res.status);
            done();
        });
    });

    it('gene-store create and get new service', function(done){
        var url = host + '/service/gene-store/substore/cell/record/' + postData.id;
        console.log("it(gene-store create and get new service) url=" + url);
        var req = request.post(url);
        //req.set('Content-Type', 'application/json');
        req.send( postData );
        req.end(function(res){
            console.log("it(put /service/gene-store/substore/cell) response: ");
            console.dir(res.body);
            //var jsonRes = JSON.parse(res.body);
            assert.equal(res.status, 201);
            //assert.ok(contains( jsonRes.status, "ok"));

            var req = request.get(host + '/service/gene-store/substore/cell/record/sentiment');
            req.end(function(res){
                console.log("it(post,get /service/gene-store/substore/cell/sentiment) res: " + res.text);
                var jsonRes = JSON.parse(res.text);
                //console.dir(jsonRes.sentiment);
                assert.equal(200, res.status);
                assert.equal('sentiment', jsonRes.id)
            });

            var req = request.get(host + '/service/gene-store/substore/cell');
            req.end(function(res){
                console.log("it(post,get,get /service/gene-store/substore/cell) res: " + res.text);
                var jsonRes = JSON.parse(res.text);
                console.dir(jsonRes.sentiment);
                assert.equal(200, res.status);
                assert.equal('sentiment', jsonRes.sentiment.id)
                done();
            });

        });
    });

    it('gene-store del new service', function(done){
        var req = request.del(host + '/service/gene-store/substore/cell/record/sentiment');
        req.end(function(res){
            console.log("it(del /service/gene-store/substore/cell/record/sentiment) response: ");
            console.dir(res.body);
            //var jsonRes = JSON.parse(res.body);
            assert.equal(204, res.status);
            //assert.ok(contains( jsonRes.status, "ok"));

            var req = request.get(host + '/service/gene-store/substore/cell/record/sentiment');
            req.end(function(res){
                console.log("it(del, get /service/gene-store/substore/cell/record/sentiment) res: " + res.text);
                var jsonRes = JSON.parse(res.text);
                console.dir(jsonRes.sentiment);
                assert.equal(404, res.status);
                done();
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
