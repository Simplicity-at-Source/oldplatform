var assert = require('assert');
var nucleusStore = require('../nucleusStore.js'); 



describe('test nucleus-store: ', function(){

    it('add and remove record', function(done){
        
        console.log('testNucluesStore.js add/remove test');
        
        var service = 'foo';
        var store = 'bah';
        var recordName = 'zip';
        var record = {name: "blah"};
        
        //console.dir(nucleusStore);
        nucleusStore.putRecord(service, store, recordName, record);
        
        var recordData = nucleusStore.getRecord(service, store, recordName);
        assert.equal(record.name, recordData.name);
        
        var storeData = nucleusStore.getStore(service, store, recordName);
        var serviceData = nucleusStore.getService(service, store, recordName);
        
        //console.log("storeData=" + JSON.stringify(storeData));
        //console.log("serviceData=" + JSON.stringify(serviceData));

        assert.equal(record.name, storeData[0].name);
        assert.equal(record.name, serviceData[store][recordName].name);
        
        done();
    });
    
    it('add and query filter from store', function(done){
        var service = 'gene-store';
        var store = 'stateless';

        var record1 = {servicename: "foo", id: "f1", config: {dns: "www.blah.com"}};
        var record2 = {servicename: "foo", id: "f2", config: {dns: "www.blah.com"}};
        var record3 = {servicename: "bar",id: "b1", config: {dns: "www.bar.com"}};
        var record4 = {servicename: "zoo", id: "z1", config: {dns: "www.zoo.com"}};
        
        nucleusStore.postRecord(service, store, record1);
        nucleusStore.postRecord(service, store, record2);
        nucleusStore.postRecord(service, store, record3);
        nucleusStore.postRecord(service, store, record4);
        
        var queryKey = "config.dns";
        var queryValue = "www.blah.com";
        var results = nucleusStore.queryStore(service, store, queryKey, queryValue);

        assert.ok(results);
        assert.equal(results[0].servicename, "foo");
        assert.equal(results[0].config.dns, "www.blah.com");
        assert.equal(results[0].id, "f1");
        assert.equal(results[1].servicename, "foo");
        assert.equal(results[1].config.dns, "www.blah.com");
        assert.equal(results[1].id, "f2");
        
        done();
    });
    
    
    it('add and query filter from service', function(done){
        var service = 'gene-store';
        var store1 = 'stateless';
        var store2 = 'cell';

        var record1 = {servicename: "foo", id: "f1", config: {dns: "www.blah.com"}};
        var record2 = {servicename: "foo", id: "f2", config: {dns: "www.blah.com"}};
        var record3 = {servicename: "bar",id: "b1", config: {dns: "www.bar.com"}};
        var record4 = {servicename: "zoo", id: "z1", config: {dns: "www.zoo.com"}};
        
        nucleusStore.postRecord(service, store1, record1);
        nucleusStore.postRecord(service, store2, record2);
        nucleusStore.postRecord(service, store1, record3);
        nucleusStore.postRecord(service, store2, record4);
        
        var queryKey = "config.dns";
        var queryValue = "www.blah.com";
        var results = nucleusStore.queryService(service, queryKey, queryValue);

        assert.ok(results);
        assert.equal(results[0].servicename, "foo");
        assert.equal(results[0].config.dns, "www.blah.com");
        assert.equal(results[0].id, "f2");
        assert.equal(results[1].servicename, "foo");
        assert.equal(results[1].config.dns, "www.blah.com");
        assert.equal(results[1].id, "f1");
        
        done();
    });    

    
});
