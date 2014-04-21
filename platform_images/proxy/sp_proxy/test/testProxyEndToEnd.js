var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
require('./mockServices.js');
var proxyurl = 'http://localhost:8888';



describe('test adding service and host via service registry', function(){

 
    
  it('test proxy calls registry and routes accordingly', function(done){
	var req = request.get(proxyurl + '/spapi/sp-control_plane/containers');
      //req.set('Host', 'simplenode');
	  req.end(function(res){
          assert.ok(contains(res.text, 'mockEndPointHandler: Hello, World!')); 
          done();
      });
  });   
    
    
  it('test proxy handles non existing  service gracefully', function(done){
	var req = request.get(proxyurl + '/spapi/does-not-exist/containers');
      //req.set('Host', 'simplenode');
	  req.end(function(res){
          //console.log("status %s", res.status);
          assert.ok(res.status); 
          assert.equal(502, res.status);
          done();
      });
  });   
     
});


function contains(string, value) {
    if (string == undefined || value == undefined ) return false;
    return string.indexOf(value) > -1    
}