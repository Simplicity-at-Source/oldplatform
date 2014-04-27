var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
require('./mockServices.js');
var proxyurl = 'http://localhost:18888';



describe('test proxy', function(){
    
  it('proxy calls docker registry and routes to correct ip', function(done){
	var req = request.get(proxyurl + '/spapi/container');
	  req.end(function(res){
          //console.log("proxy docker api res: "  + res.text);
          assert.ok(contains(res.text, 'mock control-plane response')); 
          done();
      });
  });   
    

    
  it('proxy handles non existing  service gracefully', function(done){
	var req = request.get(proxyurl + '/spapi/does-not-exist');
	  req.end(function(res){
          console.log("no-exist status %s", res.status);
          assert.ok(res.status); 
          assert.equal(502, res.status);
          done();
      });
  }); 
    
    
    
 it('proxy calls gns registry and routes to correct ip', function(done){
	var req = request.get(proxyurl + '/blah/some/path');
      req.set('Host', 'simpleservice');
	  req.end(function(res){
          console.log("gns res: " + res.text);
          assert.ok(contains(res.text, 'mockSimpleServiceHandler: Hello, World!')); 
          done();
      });
  });
  
    
    
    
     
});


function contains(string, value) {
    if (string == undefined || value == undefined ) return false;
    return string.indexOf(value) > -1    
}
