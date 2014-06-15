var  http = require('http');
var restify = require('restify');

var  apiroutes = require('./apiroutes');


var port = 8080;


function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.use(restify.bodyParser());

server.listen(port, function() {
  console.log('sp_registry listening at %s', server.url);
});


server.get('/api/:service_name/host/next', apiroutes.next_host);


server.get('/', function(req, res){
  //res.render('index', {service: 'sp_registry', add_link:'PUT /registry/xyzname', list: 'GET /registry'});
  data = {service: 'sp_registry', add_link:'PUT /registry/xyzname', list: 'GET /registry'};
  //req.write(JSON.stringify(data));
  //req.end();
  res.send(data);
});



function logErrors(err, req, res, next) {
  console.log("*****************************************************************************************************");
  console.error(err);
  next(err);
}

server.use(logErrors);

process.on('uncaughtException', function(err) {
    console.log('Threw Exception: ', err.message);
});


