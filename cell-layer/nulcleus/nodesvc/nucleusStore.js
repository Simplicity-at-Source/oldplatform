var uuid = require('node-uuid');

var nucleusStore = {};

exports.getStore = function(serviceName, subStore) {  
    if (! nucleusStore[serviceName]) {
        nucleusStore[serviceName] = {};
    }
    if (! nucleusStore[serviceName][subStore]) {
        nucleusStore[serviceName][subStore] = {};
    }
    console.log('nucleusStore.js getStore(%s, %s)', serviceName, subStore);
    var results = [];
    var store = nucleusStore[serviceName][subStore];
    for(var key in store) {
        var storeEntry = store[key];  
       results.push(storeEntry);
    };
    console.log('nucleusStore.js getStore() results=', JSON.stringify(results));
    return results;
}

exports.getAll = function(serviceName, subStore) {
    console.log('nucleusStore.js getAll() ');
     return nucleusStore;
}

exports.getService = function(serviceName) {
      return nucleusStore[serviceName];
}


exports.getRecord = function(serviceName, subStore, recordId) {
     console.log('nucleusStore.js getRecord() ');
    return nucleusStore[serviceName][subStore][recordId];
}

exports.putRecord = function(serviceName, subStore, recordId, record) {
    console.log('nucleusStore.js putRecord(%s, %s, %s, %s)', serviceName, subStore, recordId, JSON.stringify(record));
    if (! nucleusStore[serviceName]) {
        nucleusStore[serviceName] = {};
    }
    if (! nucleusStore[serviceName][subStore]) {
        nucleusStore[serviceName][subStore] = {};
    }
    //if (! nucleusStore[serviceName][subStore][recordId]) {
    //    nucleusStore[serviceName][subStore][recordId] = {};
    //}    
    nucleusStore[serviceName][subStore][recordId] = record;
}

exports.postRecord = function(serviceName, subStore, record) {
     console.log('nucleusStore.js postRecord(%s, %s, %s)', serviceName, subStore, JSON.stringify(record));
    var recordId = uuid.v4();
    if (! nucleusStore[serviceName]) {
        nucleusStore[serviceName] = {};
    }
    if (! nucleusStore[serviceName][subStore]) {
        nucleusStore[serviceName][subStore] = {};
    }  
    nucleusStore[serviceName][subStore][recordId] = record;
}


exports.deleteRecord = function(serviceName, subStore, recordId) {
    if (! nucleusStore[serviceName]) {
        return;
    }
    if (! nucleusStore[serviceName][subStore]) {
        return;
    }
    if (! nucleusStore[serviceName][subStore][recordId]) {
        return;
    }
    nucleusStore[serviceName][subStore][recordId] = undefined;
}

exports.deleteService = function(serviceName, subStore, recordId) {
     return nucleusStore[serviceName] = undefined;
}


exports.deleteSubStore = function(serviceName, subStore, recordId) {
    if (! nucleusStore[serviceName]) {
        return;
    }
    return nucleusStore[serviceName][subStore] = undefined;
}


exports.queryService = function(serviceName, queryKeyString, queryValue) { 
     if (! nucleusStore[serviceName]) {
        return [];
    }
    console.log('nucleusStore.js queryService(%s, %s, %s)', serviceName, queryKeyString, queryValue);
    var service = nucleusStore[serviceName];
    var results = [];
     for(var storeName in service) {
        var store = service[storeName];
        var storeResults = queryStore(serviceName, storeName, queryKeyString, queryValue);
        // console.log("nucleusStore.js queryService() storeResults=%s",  JSON.stringify(storeResults));
        results = results.concat(storeResults);
    };
    console.log("nucleusStore.js queryService() %s=%s results=%s",queryKeyString,queryValue,  JSON.stringify(results));
    return results;
}

function queryStore(service, store, queryKeyString, queryValue) {
      if (! nucleusStore[service]) {
        nucleusStore[service] = {};
    }
    if (! nucleusStore[service][store]) {
        nucleusStore[service][store] = {};
    }
    console.log('nucleusStore.js queryStore(%s, %s, %s, %s)', service, store, queryKeyString, queryValue);
    var store = nucleusStore[service][store];
    var results = [];
    //console.log("queryStore() initial store=" + JSON.stringify(store));
    for(var key in store) {
        var storeEntry = store[key];
        var result = getJsonValue(storeEntry, queryKeyString);
        if (result == queryValue) results.push(storeEntry);
    };
    console.log("nucleusStore.js queryStore() %s=%s results=%s",queryKeyString,queryValue,  JSON.stringify(results));
    return results;
}

exports.queryStore = function(service, store, queryKeyString, queryValue) {  
  return queryStore(service, store, queryKeyString, queryValue);
}

function getJsonValue(object, queryKeyString) {
    var queryKeys = queryKeyString.split('.');
    //console.log("getJsonValue() queryKeyString=%s", queryKeyString);
    //console.log("getJsonValue() queryKeys=%s", queryKeys);
    //console.log("getJsonValue() forObject=%s", JSON.stringify(object));
    var value = object;
    for(var i in queryKeys) {
        var qk = queryKeys[i];
        var result = value[qk];
        //console.log("getJsonValue() qk=%s intermediate result=%s", qk, result);
        if (result) value = result;
    };
    //console.log("getJsonValue() %s return value=%s", queryKeyString, JSON.stringify(value));
    return value;
} 