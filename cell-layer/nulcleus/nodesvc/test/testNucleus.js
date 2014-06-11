var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8080';
var http = require('http');
var msh = require('msh');





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

    
    
    it('create and get new service for gene-store', function(done) {

         var h = 'localhost';
            var p = '8080';
            var url = '/service/gene-store/substore/cell';
            var q = '?qk=env.DNS&qv=cronjob.muoncore.io';
            
           var payload = {"id":"sentiment","image":"sp_platform/uber-any","env":{"GIT_REPO_URL":"https://github.com/fuzzy-logic/sentiment.git", "DNS": "sentiment.muoncore.io"}};
            
            var errCallback = function(status, host, data) {
                console.log('errCallback status=%s, host=%s data=%s', status, host, data);
            };
            
            var callback = function(actions) {
                console.log('msh callback...');
               // console.dir(actions);
                
                var putStatus = actions[0].statusCode;
                var get1Status = actions[1].statusCode;
                var get2Status = actions[2].statusCode;
                var get1results = JSON.parse(actions[1].response);
                var get2results = JSON.parse(actions[2].response);
                
                assert.equal(201, putStatus);
                assert.equal(200, get1Status);
                assert.equal(200, get2Status);
                //assert.equal('cronjob1', results[0].id);
                
                done();
                
            };
             console.log('msh starting...');
            msh.init(callback, errCallback).put(h, p, url + '/record/sentiment', payload).get(h, p, url + '/record/sentiment').get(h, p, url).end();
        
        
    });
    
    
    
    
    
    it('create and query with filter for gene-store', function(done){
          
            var h = 'localhost';
            var p = '8080';
            var url = '/service/gene-store/substore/cell';
            var q = '?qk=env.DNS&qv=cronjob.muoncore.io';
            
            var data1 = {"name":"sentiment","id":"sentiment1","image":"sp_platform/uber-any","env":{"GIT_REPO_URL":"https://github.com/fuzzy-logic/sentiment.git", "DNS": "sentiment.muoncore.io"}};
            var data2 = {"name":"cronjob","id":"cronjob1","image":"sp_platform/uber-any","env":{"GIT_REPO_URL":"https://github.com/fuzzy-logic/cronjob.git", "DNS": "cronjob.muoncore.io"}};
            
            var errCallback = function(status, host, data) {
                console.log('errCallback status=%s, host=%s data=%s', status, host, data);
            };
            
            var callback = function(actions) {
                console.log('msh callback...');
               // console.dir(actions);
                
                var put1Status = actions[0].statusCode;
                var put2Status = actions[1].statusCode;
                var getStatus = actions[2].statusCode;
                var results = JSON.parse(actions[2].response);
                
                assert.equal(201, put1Status);
                assert.equal(201, put2Status);
                assert.equal(200, getStatus);
                assert.equal('cronjob1', results[0].id);
                
                done();
                
            };
             console.log('msh starting...');
            msh.init(callback, errCallback).post(h, p, url, data1).post(h, p, url, data2).get(h, p, url + q).end();
        
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
