
var nucleusStore = {};

exports.getStore = function(serviceName, subStore) {
     return nucleusStore[serviceName][subStore];
}

exports.getAll = function(serviceName, subStore) {
     return nucleusStore;
}

exports.getService = function(serviceName) {
      return nucleusStore[serviceName];
}


exports.getRecord = function(serviceName, subStore, recordId) {
    return nucleusStore[serviceName][subStore][recordId];
}

exports.addRecord = function(serviceName, subStore, recordId, record) {
    if (! nucleusStore[serviceName]) {
        nucleusStore[serviceName] = {};
    }
    if (! nucleusStore[serviceName][subStore]) {
        nucleusStore[serviceName][subStore] = {};
    }
    //if (! nucleusStore[serviceName][subStore][recordId]) {
    //    nucleusStore[serviceName][subStore][recordId] = {};
    //}    
    return nucleusStore[serviceName][subStore][recordId] = record;
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