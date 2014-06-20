// Load module dependencies.
var bodyParser = require('body-parser');
var express = require("express");
var url = require("url");
var swagger = require("swagger-node-express");
var resources = require('./resources.js');



var serviceName = "control-plane";

// Create the application.
var app = express();
app.use(express.json());
app.use(express.urlencoded());

// Couple the application to the Swagger module.
swagger.setAppHandler(app);

var models = {"Container:": {}};

swagger.addModels(models);
swagger.addGet(resources.containers);
//swagger.addGet(resources.findById);
//swagger.addGet(resources.getStore);
//swagger.addGet(resources.queryService);
//swagger.addGet(resources.queryStore);
//swagger.addGet(resources.getService);
//swagger.addPut(resources.putRecord);
//swagger.addPost(resources.postRecord);
//swagger.addDelete(resources.deleteRecord);







swagger.configureDeclaration(serviceName, {
  description : serviceName + " Service Data Store Operations",
  //authorizations : ["oauth2"],
  produces: ["application/json"]
});

swagger.setApiInfo({
  title: "Swagger " + serviceName + " App",
  description: serviceName + " API",
  termsOfServiceUrl: "http://muoncore.io/terms/",
  contact: "team@muoncore.io",
  license: "Apache 2.0",
  licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});

swagger.configureSwaggerPaths("", "/api-docs", "");

swagger.configure("http://localhost:8080", "0.1");



app.use('/swagger', express.static(__dirname + '/swagger-ui/'));

function logErrors(err, req, res, next) {
  console.error(err);
  next(err);
}




app.use(logErrors);



process.on('uncaughtException', function(err) {
    console.log('Threw Exception: ', err.message);
});

app.listen(8080, function() {
           console.log(serviceName + " listening on port 8080");           
});
