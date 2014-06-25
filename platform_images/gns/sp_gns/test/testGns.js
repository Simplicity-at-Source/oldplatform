var assert = require('assert');
var request = require("superagent");
require("./mockNucleusApi.js");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8080';

var endPointHostName = "simplenode.muon.cistechfutures.net";


var nucleusHost = process.env.MUON_NUCLEUS_IP || undefined;
var nucleusPort =  process.env.MUON_NUCLEUS_PORT || undefined;
var domain =  process.env.MUON_DOMAIN || undefined;


describe('test GNS: ', function(){

    
  it('next host round robin', function(done){
	var req = request.get(host + '/api/' + endPointHostName + '/host/next');
	req.end(function(res){
         console.log("test next host (call1) res1: " + res.text)
          var json = JSON.parse(res.text);
    	  assert.ok(json.host == '172.17.0.22' || json.host == '172.17.0.21');
          assert.ok(8080, json.port);
    	 
    	});
 
	var req2 = request.get(host + '/api/' + endPointHostName + '/host/next');
	req2.end(function(res){
          console.log("test next host (call2) res2: " + res.text)
    	  //assert.ok(contains(res.text, '192.168.0.1:80'));
          var json = JSON.parse(res.text);
    	  assert.ok(json.host == '172.17.0.22' || json.host == '172.17.0.21');
          assert.equal(8080, json.port);
    	 
    	});

	var req3 = request.get(host + '/api/' + endPointHostName + '/host/next');
	req3.end(function(res){
          console.log("test next host (call3) res3: " + res.text)
    	  //assert.ok(contains(res.text, '192.168.0.2:80'));
          var json = JSON.parse(res.text);
    	  assert.ok(json.host == '172.17.0.22' || json.host == '172.17.0.21');
          assert.ok(8080, json.port);
    	  
    	});
 
	var req4 = request.get(host + '/api/' + endPointHostName + '/host/next');
	req4.end(function(res){
          console.log("test next host (call4) res4: " + res.text)
    	  //assert.ok(contains(res.text, '192.168.0.1:80'));
          var json = JSON.parse(res.text);
    	  assert.ok(json.host == '172.17.0.22' || json.host == '172.17.0.21');
          assert.ok(8080, json.port);
    	  done();
    	});

  });    
    
    
 it('core service derived from env variables', function(done){
	var req = request.get(host + '/api/nucleus' +'.'+ domain + '/host/next');
	req.end(function(res){
         console.log("core service next host res: " + res.text)
          var json = JSON.parse(res.text);
    	  assert.ok(json.host == nucleusHost);
          assert.ok(json.port == nucleusPort);
    	 done();
    	});

  });     
     

});


function contains(string, value) {
    if (string == undefined) return false;
    return string.indexOf(value) > -1    
}



function containsOneOf(string, value1, value2) {
    if (string == undefined) return false;
    
    var contains = false;
    contains = string.indexOf(value1) > -1;
    contains = string.indexOf(value2) > -1;
    return contains
}