var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
require('./mockServices.js');
var proxyurl = 'http://localhost:8888';



describe('test adding service and host via service registry', function(){

 
    
  it('test proxy calls registry and routes accordingly', function(done){
	var req = request.get(proxyurl + '/spapi/sp-control_plane/containers');
      req.set('Host', 'simplenode');
	  req.end(function(res){
          //console.log("test response.body: " + res.body)
          //console.log("test response.text: " + res.text)
          assert.ok(contains(res.text, 'mockEndPointHandler: Hello, World!')); 
          done();
      });
 
	

  });    
     
});


function contains(string, value) {
    if (string == undefined) return false;
    return string.indexOf(value) > -1    
}