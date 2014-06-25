var transformer = require('../payloadTransformer.js');
var assert = require('assert');
var _ = require('underscore');



describe('test payloadTransformer', function(){
    
    
    it('muonToDocker transforms', function(){
            var payload = { 
                  "name": "simplenode",
                  "imageId": "foobarImage", 
                  "env": { 
                    "FIZZ": "foo", 
                    "BUZZ": "bar" 
                  }
                };
            var result = transformer.muonToDocker(payload);
            //console.log('muonToDocker() result: ' + JSON.stringify(result) );
            assert.equal('foobarImage', result.Image);
            assert.ok(_.contains(result.Env, 'FIZZ=foo'));
            assert.ok(_.contains(result.Env, 'BUZZ=bar'));
    });

    
    it('getEnvironmentVariables transforms env vars', function(){
            var payload = { 
                  "name": "simplenode",
                  "imageId": "foobarImage", 
                  "count": 3,
                  "env": { 
                    "FIZZ": "foo", 
                    "BUZZ": "bar" 
                  }
                };
            var result = transformer.getEnvironmentVariables(payload);
            //console.log('getEnvironmentVariables() result: "' + result + '"');
            assert.ok(_.contains(result, 'FIZZ=foo'));
            assert.ok(_.contains(result, 'BUZZ=bar'));
    });
    
});
    