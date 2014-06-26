var sw = require("swagger-node-express");
//var param = require("../lib/paramTypes.js");
var url = require("url");
var nucleusStore = require('./nucleusStore.js');
var swe = sw.errors;

exports.init = function(notify) {
    console.log ("Initialising resources with notificaiton");
    module.notification = notify;
};

exports.root = {
  'spec': {
    description : "Return all data in nulceus",  
    path : "/",
    method: "GET",
    summary : "Return all data",
    notes : "Returns all service records",
    type : "array",
    nickname : "root",
    produces : ["application/json"],
    parameters : [],
    responseMessages : [swe.notFound('item')]
  },
  'action': function (req,res) {
     console.log('resources.js root()');
   
    res.send(JSON.stringify(nucleusStore.getAll()));
  }
};


// the description will be picked up in the resource listing
exports.findById = {
  'spec': {
    description : "Find nucleus stored item by id",  
    path : "/service/{serviceName}/substore/{subStore}/record/{recordId}",
    method: "GET",
    summary : "Find custom record by ID",
    notes : "Returns a /service/dtore/recordId custom record based on ID",
    type : "Record",
    nickname : "getRecordById",
    produces : ["application/json"],
    parameters : [sw.pathParam("serviceName", "Name of of cleint service that will store the record", "string"), 
                  sw.pathParam("subStore", "Name of service sub-store that needs to be fetched e.g: 'cel'' for gene store", "string"), 
                  sw.pathParam("recordId", "ID of record that needs to be fetched", "string")],
    responseMessages : [swe.invalid('recordId'), swe.notFound('item'), swe.invalid('subStore'), swe.invalid('serviceName')]
  },
  'action': function (req,res) {
     console.log('resources.js findById()');
    if (! req.params.serviceName) {
      throw swe.invalid('serviceName'); 
    }
    if (! req.params.subStore) {
      throw swe.invalid('subStore'); 
    }
    if (! req.params.recordId) {
      throw swe.invalid('recordId'); 
    }
      
    var recordId = req.params.recordId;
    var serviceName = req.params.serviceName;
    var subStore = req.params.subStore;
    
    console.log('resources.js findById() serviceName=%s, subStore=%s, recordId=%s', serviceName, subStore, recordId);
    var record = nucleusStore.getRecord(serviceName, subStore, recordId);
    console.log('resources.js findById() returning record: %s', JSON.stringify(record));
    if(record) res.send(JSON.stringify(record));
    else throw swe.notFound('record',res);
  }
};


exports.queryService = {
  'spec': {
    description : "Return and filter records in a service",  
    path : "/service/{serviceName}",
    method: "GET",
    summary : "Filter records in a service",
    notes : "Returns array of records",
    type : "array",
    nickname : "queryServiceData",
    produces : ["application/json"],
    parameters : [sw.pathParam("serviceName", "Name of of cleint service that will store the record", "string"), 
                  sw.queryParam("qk", "Json key to query", "string", false),
                  sw.queryParam("qv", "Key value to filter by", "string", false)],
    responseMessages : [swe.notFound('item'), swe.invalid('serviceName')]
  },
  'action': function (req,res) {
    console.log('resources.js queryStore()');
    if (! req.params.serviceName) {
      throw swe.invalid('serviceName'); 
    }
      
    var serviceName = req.params.serviceName;
      console.log('resources.js queryService() serviceName=%s', serviceName);
      
    var queryKeysString = req.query.qk;
    var queryValue = req.query.qv;
      
      console.log('resources.js queryService() qk=%s,qv=%s', queryKeysString , queryValue);
      
       var serviceData;
      if (! queryKeysString || ! queryValue) {
          serviceData  = nucleusStore.getService(serviceName);
      } else {
          serviceData = nucleusStore.queryService(serviceName, queryKeysString, queryValue);
      }
    
    
    console.log('resources.js queryService() serviceData=' + JSON.stringify(serviceData));
      
    if(serviceData) res.send(JSON.stringify(serviceData));
    else throw swe.notFound('serviceData ' + serviceData, res);
  }
};



exports.queryStore = {
  'spec': {
    description : "Return and filter records in substore",  
    path : "/service/{serviceName}/substore/{subStore}",
    method: "GET",
    summary : "Filter records in a service's sub-store",
    notes : "Returns array of records",
    type : "array",
    nickname : "getStoreData",
    produces : ["application/json"],
    parameters : [sw.pathParam("serviceName", "Name of of cleint service that will store the record", "string"), 
                  sw.pathParam("subStore", "Name of service sub-store that needs to be fetched e.g: 'cel'' for gene store", "string"),
                  sw.queryParam("qk", "Json key to query", "string", false),
                  sw.queryParam("qv", "Key value to filter by", "string", false)],
    responseMessages : [swe.notFound('item'), swe.invalid('subStore'), swe.invalid('serviceName')]
  },
  'action': function (req,res) {
    console.log('resources.js queryStore()');
    if (! req.params.serviceName) {
      throw swe.invalid('serviceName'); 
    }
    if (! req.params.subStore) {
      throw swe.invalid('subStore'); 
    }
      
    var serviceName = req.params.serviceName;
    var subStore = req.params.subStore;
      console.log('resources.js queryStore() serviceName=%s,subStore=%s', serviceName , subStore);
      
    var queryKeysString = req.query.qk;
    var queryValue = req.query.qv;
      
      console.log('resources.js queryStore() qk=%s,qv=%s', queryKeysString , queryValue);
      
       var subStoreData;
      if (! queryKeysString || ! queryValue) {
          subStoreData  = nucleusStore.getStore(serviceName, subStore);
      } else {
          subStoreData = nucleusStore.queryStore(serviceName, subStore, queryKeysString, queryValue);
      }
    
    
    console.log('resources.js queryStore() subStoreData=' + JSON.stringify(subStoreData));
      
    if(subStoreData) res.send(JSON.stringify(subStoreData));
    else throw swe.notFound('subStore ' + subStore, res);
  }
};

exports.getService = {
  'spec': {
    description : "Return all records in substore",  
    path : "/service/{serviceName}",
    method: "GET",
    summary : "Return all records in all stores for a service",
    notes : "Returns map of subStores for a service",
    type : "Service",
    nickname : "getServiceData",
    produces : ["application/json"],
    parameters : [sw.pathParam("serviceName", "Name of of cleint service that will store the record", "string")],
    responseMessages : [swe.notFound('service'), swe.invalid('serviceName')]
  },
  'action': function (req,res) {
    console.log('resources.js getService()');
    if (! req.params.serviceName) {
      throw swe.invalid('serviceName'); 
    }

    var serviceName = req.params.serviceName;

    
    var serviceData = nucleusStore.getService(serviceName);

    if(serviceData) res.send(JSON.stringify(serviceData));
    else throw swe.notFound('service',res);
  }
};


exports.putRecord = {
  'spec': {
    path : "/service/{serviceName}/substore/{subStore}/record/{recordId}",
    notes : "add a record",
    summary : "Add a new record to the service store",
    method: "PUT",  
    nickname: "addRecord",
    parameters : [sw.pathParam("serviceName", "Name of of cleint service that will store the record", "string"), 
                  sw.pathParam("subStore", "Name of service sub-store that needs to be fetched e.g: 'cel'' for gene store", "string"), 
                  sw.pathParam("recordId", "ID of record that needs to be fetched", "string"),
                  sw.bodyParam("Record", "Record object to be added to the store", "Record")],
    responseMessages : [swe.invalid('recordId'), swe.notFound('record'), swe.invalid('subStore'), swe.invalid('serviceName')]
  },
  'action': function (req,res) {
    //console.log('resources.js putRecord()');
    if (! req.params.serviceName) {
      throw swe.invalid('serviceName'); 
    }
    if (! req.params.subStore) {
      throw swe.invalid('subStore'); 
    }
    if (! req.params.recordId) {
      throw swe.invalid('recordId'); 
    }
      
    var recordId = req.params.recordId;
    var serviceName = req.params.serviceName;
    var subStore = req.params.subStore;
    
    console.log('resources.js putRecord() req.body=' + JSON.stringify(req.body));
    var payload = req.body;
    //console.log('resources.js putRecord() payload=' + payload);
    nucleusStore.putRecord(serviceName, subStore, recordId, payload);

    res.send(201, {message: "created"});

    module.notification({
        type:"PUT",
        serviceName:serviceName,
        subStore:subStore,
        recordId:recordId,
        payload:payload
    });
  }
};




exports.postRecord = {
  'spec': {
    path : "/service/{serviceName}/substore/{subStore}",
    notes : "add a record",
    summary : "Add a new record to the service store",
    method: "POST",  
    nickname: "postRecord",
    parameters : [sw.pathParam("serviceName", "Name of of cleint service that will store the record", "string"), 
                  sw.pathParam("subStore", "Name of service sub-store that needs to be fetched e.g: 'cel'' for gene store", "string"), 
                  sw.bodyParam("Record", "Record object to be added to the store", "Record")],
    responseMessages : [swe.invalid('substore'), swe.invalid('serviceName')]
  },
  'action': function (req,res) {
    //console.log('resources.js postRecord()');
    if (! req.params.serviceName) {
      throw swe.invalid('serviceName'); 
    }
    if (! req.params.subStore) {
      throw swe.invalid('subStore'); 
    }

    var serviceName = req.params.serviceName;
    var subStore = req.params.subStore;
    
    console.log('resources.js postRecord() req.body=' + JSON.stringify(req.body));
    var payload = req.body;
    //console.log('resources.js postRecord() payload=' + payload);
    var id = nucleusStore.postRecord(serviceName, subStore, payload);

    res.set('Location:', "/service/" + serviceName + "/substore/" + subStore + "/record/" + id);
    res.send(201, {message: "created"});

      module.notification({
          type:"POST",
          serviceName:serviceName,
          subStore:subStore,
          recordId:id,
          payload:payload
      });
  }
};


exports.deleteRecord = {
  'spec': {
    path : "/service/{serviceName}/substore/{subStore}/record/{recordId}",
    notes : "delete a record",
    summary : "Delete a record from the service store",
    method: "DELETE",  
    nickname: "deleteRecord",
    parameters : [sw.pathParam("serviceName", "Name of of cleint service that will store the record", "string"), 
                  sw.pathParam("subStore", "Name of service sub-store that needs to be fetched e.g: 'cel'' for gene store", "string"), 
                  sw.pathParam("recordId", "ID of record that needs to be fetched", "string")],
    responseMessages : [swe.invalid('recordId'), swe.notFound('item'), swe.invalid('subStore'), swe.invalid('serviceName')]
  },
  'action': function (req,res) {
    console.log('resources.js deleteRecord()');
    if (! req.params.serviceName) {
      throw swe.invalid('serviceName'); 
    }
    if (! req.params.subStore) {
      throw swe.invalid('subStore'); 
    }
    if (! req.params.recordId) {
      throw swe.invalid('recordId'); 
    }
      
    var recordId = req.params.recordId;
    var serviceName = req.params.serviceName;
    var subStore = req.params.subStore;
          
    nucleusStore.deleteRecord(serviceName, subStore, recordId);

    res.send(204);

      module.notification({
          type:"DELETE",
          serviceName:serviceName,
          subStore:subStore,
          recordId:recordId,
          payload:payload
      });
  }
};
