var assert = require('assert');
var proxyUtils = require('../proxyUtils.js');

process.env.SP_DOCKER_HOST = 'locolhost';

describe('Test Proxy Url Utils', function(){
    
      it('convertApiPath removes api start path', function(){
      var path = '/spapi/control-plane/containers'; 
      var newPath = proxyUtils.convertApiPath(path);
      assert.equal('/containers', newPath);
    })  
})