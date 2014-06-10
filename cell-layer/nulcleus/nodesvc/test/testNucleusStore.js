var assert = require('assert');
var nucleusStore = require('../nucleusStore.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8080';



var postData = {"id":"sentiment","image":"sp_platform/uber-any","env":{"GIT_REPO_URL":"https://github.com/fuzzy-logic/sentiment.git"}};

describe('test nucleus-store: ', function(){

    it('add and remove from store', function(done){
        var service = 'foo';
        var store = 'bah';
        var recordName = 'zip';
        var record = {name: "blah"};
        nucleusStore.addRecord(service, store, recordName, record);
        
        var recordData = nucleusStore.getRecord(service, store, recordName);
        assert.equal(record.name, recordData.name);
        
        var storeData = nucleusStore.getStore(service, store, recordName);
        var serviceData = nucleusStore.getService(service, store, recordName);
        
        //console.log("storeData=" + JSON.stringify(storeData));
        //console.log("serviceData=" + JSON.stringify(serviceData));
        
        
        assert.equal(record.name, storeData[recordName].name);
        assert.equal(record.name, serviceData[store][recordName].name);
        
        done();
    });

    
});
