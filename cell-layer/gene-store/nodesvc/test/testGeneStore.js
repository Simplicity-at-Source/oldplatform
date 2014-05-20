var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8080';

/*

Gene Store Data:
{"cell":{"sentanal":{"id":"sentanal","image":"sp_platform/uber-any","env":{"GIT_REPO_URL":"https://github.com/fuzzy-logic/sentanal.git"}}}}

{"cell":{"sentanal":{"id":"sentanal","image":"sp_platform/uber-any","env":{"GIT_REPO_URL":"https://github.com/fuzzy-logic/sentanal.git"}}}}

*/

var postData = {"id":"sentanal","image":"sp_platform/uber-any","env":{"GIT_REPO_URL":"https://github.com/fuzzy-logic/sentanal.git"}};

describe('test gene-store: ', function(){

    it('/ works ok', function(done){
        var req = request.get(host + '/');
        req.end(function(res){
            console.log("/ res: " + res.text);
            var json = JSON.parse(res.text);
            assert.equal(200, res.status);
            done();
        });
    });

    it('gene-store create and get new service', function(done){
        var req = request.post(host + '/cell');
        //req.set('Content-Type', 'application/json');
        req.send( postData );
        req.end(function(res){
            console.log("it(post gene-store) response: ");
            console.dir(res.body);
            //var jsonRes = JSON.parse(res.body);
            assert.equal(200, res.status);
            //assert.ok(contains( jsonRes.status, "ok"));

            var req = request.get(host + '/cell/sentanal');
            req.end(function(res){
                console.log("it(post, get gene-store) res: " + res.text);
                var jsonRes = JSON.parse(res.text);
                console.dir(jsonRes.sentanal);
                assert.equal(200, res.status);
                assert.equal('sentanal', jsonRes.id)
            });

            var req = request.get(host + '/cell');
            req.end(function(res){
                console.log("it(post, get /cell gene-store) res: " + res.text);
                var jsonRes = JSON.parse(res.text);
                console.dir(jsonRes.sentanal);
                assert.equal(200, res.status);
                assert.equal('sentanal', jsonRes.cell.sentanal.id)
                done();
            });

        });
    });

    it('gene-store del new service', function(done){
        var req = request.del(host + '/cell/sentanal');
        req.end(function(res){
            console.log("it(del gene-store) response: ");
            console.dir(res.body);
            //var jsonRes = JSON.parse(res.body);
            assert.equal(200, res.status);
            //assert.ok(contains( jsonRes.status, "ok"));

            var req = request.get(host + '/cell/sentanal');
            req.end(function(res){
                console.log("it(del, get gene-store) res: " + res.text);
                var jsonRes = JSON.parse(res.text);
                console.dir(jsonRes.sentanal);
                assert.equal(404, res.status);
                done();
            });

        });
    });
});
