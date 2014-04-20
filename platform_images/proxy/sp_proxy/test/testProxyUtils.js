var assert = require('assert');
var proxyUtils = require('../proxyUtils.js');



describe('Test Proxy Url Utils', function(){
    
      it('convertApiPath removes api start path', function(){
      var path = '/spapi/control-plane/containers'; 
      var newPath = proxyUtils.convertApiPath(path);
      assert.equal('/containers', newPath);
    })  
})