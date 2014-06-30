var sw = require("swagger-node-express");
//var param = require("../lib/paramTypes.js");
var url = require("url");
var nucleusStore = require('./nucleusStore.js');
var swe = sw.errors;

exports.init = function (notify) {
    console.log("Initialising resources with notificaiton");
    module.notification = notify;
};

exports.root = {
    'spec': {
        description: "Return all data in nulceus",
        path: "/",
        method: "GET",
        summary: "Return all data",
        notes: "Returns all service records",
        type: "array",
        nickname: "root",
        produces: ["application/json"],
        parameters: [],
        responseMessages: [swe.notFound('item')]
    },
    'action': function (req, res) {
        console.log('resources.js root()');

        res.send(JSON.stringify(nucleusStore.getAll()));
    }
};


// the description will be picked up in the resource listing
exports.findById = {
    'spec': {
        description: "Find nucleus stored item by id",
        path: "/resource/{resource}/type/{type}/record/{recordId}",
        method: "GET",
        summary: "Find custom record by ID",
        notes: "Returns a /service/dtore/recordId custom record based on ID",
        type: "Record",
        nickname: "getRecordById",
        produces: ["application/json"],
        parameters: [sw.pathParam("resource", "Name of of cleint service that will store the record", "string"),
            sw.pathParam("type", "Name of service sub-store that needs to be fetched e.g: 'cel'' for gene store", "string"),
            sw.pathParam("recordId", "ID of record that needs to be fetched", "string")],
        responseMessages: [swe.invalid('recordId'), swe.notFound('item'), swe.invalid('type'), swe.invalid('resource')]
    },
    'action': function (req, res) {
        console.log('resources.js findById()');
        if (!req.params.resource) {
            throw swe.invalid('resource');
        }
        if (!req.params.type) {
            throw swe.invalid('type');
        }
        if (!req.params.recordId) {
            throw swe.invalid('recordId');
        }

        var recordId = req.params.recordId;
        var resource = req.params.resource;
        var type = req.params.type;

        console.log('resources.js findById() resource=%s, type=%s, recordId=%s', resource, type, recordId);
        var record = nucleusStore.getRecord(resource, type, recordId);
        console.log('resources.js findById() returning record: %s', JSON.stringify(record));
        if (record) res.send(JSON.stringify(record));
        else throw swe.notFound('record', res);
    }
};


exports.queryService = {
    'spec': {
        description: "Return and filter records in a service",
        path: "/resource/{resource}",
        method: "GET",
        summary: "Filter records in a service",
        notes: "Returns array of records",
        type: "array",
        nickname: "queryServiceData",
        produces: ["application/json"],
        parameters: [sw.pathParam("resource", "Name of of cleint service that will store the record", "string"),
            sw.queryParam("qk", "Json key to query", "string", false),
            sw.queryParam("qv", "Key value to filter by", "string", false)],
        responseMessages: [swe.notFound('item'), swe.invalid('resource')]
    },
    'action': function (req, res) {
        console.log('resources.js queryStore()');
        if (!req.params.resource) {
            throw swe.invalid('resource');
        }

        var resource = req.params.resource;
        console.log('resources.js queryService() resource=%s', resource);

        var queryKeysString = req.query.qk;
        var queryValue = req.query.qv;

        console.log('resources.js queryService() qk=%s,qv=%s', queryKeysString, queryValue);

        var serviceData;
        if (!queryKeysString || !queryValue) {
            serviceData = nucleusStore.getService(resource);
        } else {
            serviceData = nucleusStore.queryService(resource, queryKeysString, queryValue);
        }


        console.log('resources.js queryService() serviceData=' + JSON.stringify(serviceData));

        if (serviceData) res.send(JSON.stringify(serviceData));
        else throw swe.notFound('serviceData ' + serviceData, res);
    }
};


exports.queryStore = {
    'spec': {
        description: "Return and filter records in type",
        path: "/resource/{resource}/{type}",
        method: "GET",
        summary: "Filter records in a service's sub-store",
        notes: "Returns array of records",
        type: "array",
        nickname: "getStoreData",
        produces: ["application/json"],
        parameters: [sw.pathParam("resource", "The resource being stored", "string"),
            sw.pathParam("type", "The type of record within a resource, 'gene', 'runtime', 'error'", "string"),
            sw.queryParam("qk", "Json key to query", "string", false),
            sw.queryParam("qv", "Key value to filter by", "string", false)],
        responseMessages: [swe.notFound('item'), swe.invalid('type'), swe.invalid('resource')]
    },
    'action': function (req, res) {
        console.log('resources.js queryStore()');
        if (!req.params.resource) {
            throw swe.invalid('resource');
        }
        if (!req.params.type) {
            throw swe.invalid('type');
        }

        var resource = req.params.resource;
        var type = req.params.type;
        console.log('resources.js queryStore() resource=%s,type=%s', resource, type);

        var queryKeysString = req.query.qk;
        var queryValue = req.query.qv;

        console.log('resources.js queryStore() qk=%s,qv=%s', queryKeysString, queryValue);

        var typeData;
        if (!queryKeysString || !queryValue) {
            typeData = nucleusStore.getStore(resource, type);
        } else {
            typeData = nucleusStore.queryStore(resource, type, queryKeysString, queryValue);
        }


        console.log('resources.js queryStore() typeData=' + JSON.stringify(typeData));

        if (typeData) res.send(JSON.stringify(typeData));
        else throw swe.notFound('type ' + type, res);
    }
};

exports.getService = {
    'spec': {
        description: "Return all records in type",
        path: "/resource/{resource}",
        method: "GET",
        summary: "Return all records in all stores for a service",
        notes: "Returns map of types for a service",
        type: "Service",
        nickname: "getServiceData",
        produces: ["application/json"],
        parameters: [sw.pathParam("resource", "Name of of cleint service that will store the record", "string")],
        responseMessages: [swe.notFound('service'), swe.invalid('resource')]
    },
    'action': function (req, res) {
        console.log('resources.js getService()');
        if (!req.params.resource) {
            throw swe.invalid('resource');
        }

        var resource = req.params.resource;

        var serviceData = nucleusStore.getService(resource);

        if (serviceData) res.send(JSON.stringify(serviceData));
        else throw swe.notFound('service', res);
    }
};


exports.putRecord = {
    'spec': {
        path: "/resource/{resource}/type/{type}/record/{recordId}",
        notes: "add a record",
        summary: "Add a new record to the service store",
        method: "PUT",
        nickname: "addRecord",
        parameters: [sw.pathParam("resource", "Name of of cleint service that will store the record", "string"),
            sw.pathParam("type", "Name of service sub-store that needs to be fetched e.g: 'cel'' for gene store", "string"),
            sw.pathParam("recordId", "ID of record that needs to be fetched", "string"),
            sw.bodyParam("Record", "Record object to be added to the store", "Record")],
        responseMessages: [swe.invalid('recordId'), swe.notFound('record'), swe.invalid('type'), swe.invalid('resource')]
    },
    'action': function (req, res) {
        //console.log('resources.js putRecord()');
        if (!req.params.resource) {
            throw swe.invalid('resource');
        }
        if (!req.params.type) {
            throw swe.invalid('type');
        }
        if (!req.params.recordId) {
            throw swe.invalid('recordId');
        }

        var recordId = req.params.recordId;
        var resource = req.params.resource;
        var type = req.params.type;

        console.log('resources.js putRecord() req.body=' + JSON.stringify(req.body));
        var payload = req.body;
        //console.log('resources.js putRecord() payload=' + payload);
        nucleusStore.putRecord(resource, type, recordId, payload);

        res.send(201, {message: "created"});

        module.notification({
            action: "put",
            resource: resource,
            type: type,
            recordId: recordId,
            payload: payload
        });
    }
};


exports.postRecord = {
    'spec': {
        path: "/resource/{resource}/type/{type}",
        notes: "add a record",
        summary: "Add a new record to the service store",
        method: "POST",
        nickname: "postRecord",
        parameters: [sw.pathParam("resource", "Name of of cleint service that will store the record", "string"),
            sw.pathParam("type", "Name of service sub-store that needs to be fetched e.g: 'cel'' for gene store", "string"),
            sw.bodyParam("Record", "Record object to be added to the store", "Record")],
        responseMessages: [swe.invalid('type'), swe.invalid('resource')]
    },
    'action': function (req, res) {
        //console.log('resources.js postRecord()');
        if (!req.params.resource) {
            throw swe.invalid('resource');
        }
        if (!req.params.type) {
            throw swe.invalid('type');
        }

        var resource = req.params.resource;
        var type = req.params.type;

        console.log('resources.js postRecord() req.body=' + JSON.stringify(req.body));
        var payload = req.body;
        //console.log('resources.js postRecord() payload=' + payload);
        var id = nucleusStore.postRecord(resource, type, payload);

        res.set('Location:', "/service/" + resource + "/type/" + type + "/record/" + id);
        res.send(201, {message: "created"});

        module.notification({
            action: "post",
            resource: resource,
            type: type,
            recordId: id,
            payload: payload
        });
    }
};


exports.deleteRecord = {
    'spec': {
        path: "/resource/{resource}/type/{type}/record/{recordId}",
        notes: "delete a record",
        summary: "Delete a record from the service store",
        method: "DELETE",
        nickname: "deleteRecord",
        parameters: [sw.pathParam("resource", "Name of of cleint service that will store the record", "string"),
            sw.pathParam("type", "Name of service sub-store that needs to be fetched e.g: 'cel'' for gene store", "string"),
            sw.pathParam("recordId", "ID of record that needs to be fetched", "string")],
        responseMessages: [swe.invalid('recordId'), swe.notFound('item'), swe.invalid('type'), swe.invalid('resource')]
    },
    'action': function (req, res) {
        console.log('resources.js deleteRecord()');
        if (!req.params.resource) {
            throw swe.invalid('resource');
        }
        if (!req.params.type) {
            throw swe.invalid('type');
        }
        if (!req.params.recordId) {
            throw swe.invalid('recordId');
        }

        var recordId = req.params.recordId;
        var resource = req.params.resource;
        var type = req.params.type;

        nucleusStore.deleteRecord(resource, type, recordId);

        res.send(204);

        module.notification({
            action: "delete",
            resource: resource,
            type: type,
            recordId: recordId,
            payload: payload
        });
    }
};
