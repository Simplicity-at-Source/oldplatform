// Load module dependencies.
var bodyParser = require('body-parser');
var express = require("express");
var url = require("url");
var swagger = require("swagger-node-express");
var resources = require('./resources.js');

// Create the application.
var app = express();
app.use(express.json());
app.use(express.urlencoded());

// Couple the application to the Swagger module.
swagger.setAppHandler(app);

var models = {"Record:": {}};

swagger.addModels(models);
swagger.addGet(resources.root);
swagger.addGet(resources.findById);
//swagger.addGet(resources.getStore);
swagger.addGet(resources.queryStore);
swagger.addGet(resources.getService);
swagger.addPut(resources.putRecord);
swagger.addPost(resources.postRecord);
swagger.addDelete(resources.deleteRecord);

swagger.configureDeclaration("Nucleus", {
  description : "Nuclues Service Data Store Operations",
  //authorizations : ["oauth2"],
  produces: ["application/json"]
});

swagger.setApiInfo({
  title: "Swagger Sample App",
  description: "Nucleus API",
  termsOfServiceUrl: "http://muoncore.io/terms/",
  contact: "team@muoncore.io",
  license: "Apache 2.0",
  licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});

swagger.configureSwaggerPaths("", "/api-docs", "");

swagger.configure("http://localhost:8080", "0.1");

/*

var docs_handler = express.static(__dirname + '/swagger-ui/');

app.get('/swagger', function(req, res, next) {
  console.log('GET /swagger');
  if (req.url === '/swagger') { // express static barfs on root url w/o trailing slash
    console.log('GET /swagger redirect');
    res.writeHead(302, { 'Location' : req.url + '/' });
    res.end();
    return;
  }
  console.log('GET /swagger/');
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/swagger'.length);
  return docs_handler(req, res, next);
});
*/

app.use('/swagger', express.static(__dirname + '/swagger-ui/'));

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}



/*
function clientErrorHandler(err, req, res, next) {
  console.log('clientErrorHandler');
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}
*/

/*
function errorHandler(err, req, res, next) {
  console.log('errorHandler: ' + err);
  res.send(500, err.message);
  //res.render('error', { error: err });
}
*/

app.use(logErrors);
//app.use(clientErrorHandler);
//app.use(errorHandler);

/*
app.on('uncaughtException', function(req, res, route, err) {
        console.log("uncaughtException err: " + err.message);
        //console.dir(dir);
        console.log(err.stack);
        res.send(err);
    }
);
*/

//app.configure('development', function() {
  //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//});

process.on('uncaughtException', function(err) {
    console.log('Threw Exception: ', err.message);
});

app.listen(8080, function() {
           console.log("listen on port 8080");           
});
