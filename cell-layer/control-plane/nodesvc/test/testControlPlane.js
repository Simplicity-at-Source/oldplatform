var assert = require('assert');
var url = require('url');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8080';
var http = require('http');
var msh = require('msh');
var _ = require('underscore');
var mockDockerApi = require("./mockDockerApi.js");

var testFile = 'testControlPlane.js';

var testLog = testFile + '';


var mockDockerPort = process.env.SP_DOCKER_PORT || 14321;
var mockNucleusPort = process.env.SP_NUCLEUS_PORT || 18080;

var testService = 'control-plane';



describe('test ' + testService +': ', function(){

    it(testFile + ' /container works ok', function(done){
        var req = request.get(host + '/container');
        req.end(function(res){
            var ids = getListByKey(mockDockerApi.dockerContainersListJson(), 'Id');         
             log('GET /container', 'res.text', res.text);
            var json = JSON.parse(res.text);
            assert.equal(200, res.status);
            for (var i = 0 ; i < ids.length ; i++) {
                 var entry = _.findWhere(json, {Id: ids[i]});
                 assert.equal(ids[i], entry.Id);
                 log('GET /container', 'found in response id=', ids[i]);
            }
            done();
        });
    });

    it(testFile + ' /container/b87af06.../json works ok', function(done){
        var req = request.get(host + '/container/b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a');
        req.end(function(res){
            var ids = getListByKey(mockDockerApi.dockerContainersListJson(), 'Id');         
            log('GET /container/b87af0617...', 'res.text', res.text);
            var json = JSON.parse(res.text);
            assert.equal(200, res.status);
            assert.equal('b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a', json.Id);
            done();
        });
    });
    
    
    it(testFile + ' create container via post /container', function(done){
         var payload = { 
                 "name": "simplenode",
                  "imageId": "foobarImage", 
                  "env": { 
                    "FIZZ": "foo", 
                    "BUZZ": "bar" 
                  }
                };
        var req = request.post(host + '/container');
        req.send(payload);
        req.end(function(res){   
            log('POST /container', 'res.text', res.text);
            var json = JSON.parse(res.text);
            assert.equal(201, res.status);
            assert.equal('Container created', json.message);
            assert.equal('xyz123', json.id);
            done();
        });
    }); 
    
    
    it(testFile + ' delete container via delete /container', function(done){
        var req = request.del(host + '/container/xyz123');
        req.end(function(res){   
            log('DELETE /container/xyz123', 'res.text', res.text);
            //console.dir(res);
            var json = JSON.parse(res.text);
            assert.equal(200, res.status);
            //assert.equal('Container Destroyed', json.message);
            done();
        });
    });      
    
    
});



function getListByKey(list, keyName) {
    
    var response = [];
    for(var key in list) {
        value = list[key];
        //log('getListByKey()', 'value', value[keyName]);
        response.push(value[keyName]);
    }
    return response;
}



function log(testname, dataName, data) {
    if (!data) {
        data = {};
    }
    var dataStr = data; 
    try {
        dataStr = JSON.stringify(data);    
    }catch (e) {  }
    var logLength = dataStr < 100 ? dataStr.length : 100;
    console.log('LOGGER ********** ' + testFile + " " + testname + " " + dataName + ": " + dataStr.substring(0, 100));
}




