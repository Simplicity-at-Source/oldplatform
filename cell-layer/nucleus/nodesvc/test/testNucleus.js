var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8080';
var http = require('http');
var msh = require('msh');





describe('test nucleus: ', function(){

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

    
    
    it('create and retrieve record for gene-store', function(done) {

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
    
    
    
    
    
    it('create pokemon records and query store level with json filter', function(done){
          
            var h = 'localhost';
            var p = '8080';
            var url = '/service/pokemon/substore/muon';
            var q = '?qk=config.env&qv=cronjob.muoncore.io';
            
            var data1 = {"name":"sentiment","id":"sentiment1","image":"sp_platform/uber-any","config": {"env":["GIT_REPO_URL=https://github.com/fuzzy-logic/cronjob.git", "DNSHOST=sentiment.muoncore.io"]}};
            var data2 = {"name":"cronjob","id":"cronjob1","image":"sp_platform/uber-any","config": {"env":["GIT_REPO_URL=https://github.com/fuzzy-logic/cronjob.git", "DNSHOST=cronjob.muoncore.io"]}};
            
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
    
    
    it('create records for mutiple substores of foobar service and re-query at service level with json filter', function(done){
          
            var h = 'localhost';
            var p = '8080';
            var svc1Url = '/service/foobar/substore/aa';
            var svc2Url = '/service/foobar/substore/bb';
            var q = '?qk=endpoint.method&qv=GET';
            
            var data1 = {"name":"service1","id":"xyz123","endpoint":{"url":"http://service1.com/pay", "method": "POST"}};
            var data2 = {"name":"service2","id":"abc789","endpoint":{"url":"http://service2.com/login", "method": "POST"}}; 
            var data3 = {"name":"service3","id":"def456","endpoint":{"url":"http://service3.com/product/1", "method": "GET"}}; 
            var data4 = {"name":"service4","id":"ghi000","endpoint":{"url":"http://service4.com/catalogue", "method": "GET"}}; 
                
            var errCallback = function(status, host, data) {
                console.log('errCallback status=%s, host=%s data=%s', status, host, data);
            };
            
            var callback = function(actions) {
                console.log('msh callback...');
               // console.dir(actions);
                
                var put1Status = actions[0].statusCode;
                var put2Status = actions[1].statusCode;
                var put3Status = actions[2].statusCode;
                var put4Status = actions[3].statusCode;
                var getStatus = actions[4].statusCode;
                var results = JSON.parse(actions[4].response);
                
                assert.equal(201, put1Status);
                assert.equal(201, put2Status);
                assert.equal(201, put3Status);
                assert.equal(201, put4Status);
                assert.equal(200, getStatus);
                assert.equal('service3', results[0].name);
                assert.equal('service4', results[1].name);
                assert.ok(results[0].nucleusId); //make sure nucleus adds it's id to the json data
                
                done();
                
            };
             console.log('msh starting...');
            msh.init(callback, errCallback).post(h, p, svc1Url, data1).post(h, p, svc2Url, data2).post(h, p, svc1Url, data3).post(h, p, svc2Url, data4).get(h, p, '/service/foobar' + q).end();
        
    });    
    
    

    
    
    it('create and delete records for testservice', function(done) {

         var h = 'localhost';
            var p = '8080';
            var url = '/service/testservice/substore/default/record/blah';
            
           var payload = {"id":"sentiment", "name": "sentiment service"};
            
            var errCallback = function(status, host, data) {
                console.log('errCallback status=%s, host=%s data=%s', status, host, data);
            };
            
            var callback = function(actions) {
                console.log('msh callback...');
               // console.dir(actions);
                
                var putStatus = actions[0].statusCode;
                var get1Status = actions[1].statusCode;
                var delStatus = actions[2].statusCode;
                var get2Status = actions[3].statusCode;
                
                assert.equal(201, putStatus);
                assert.equal(200, get1Status);
                assert.equal(204, delStatus);
                assert.equal(404, get2Status);
                //assert.equal('cronjob1', results[0].id);
                
                done();
                
            };
             console.log('msh starting...');
            msh.init(callback, errCallback).put(h, p, url, payload).get(h, p, url).del(h, p, url).get(h, p, url).end();

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
