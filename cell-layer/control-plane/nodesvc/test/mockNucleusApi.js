var http = require('http');
 url  = require('url');

var port = 18081;


var log = {};

function apiHandler(req, res) { 
   var url_parts = url.parse(req.url);
   console.log('mockNucleusApi ' + req.method + ' ' + url_parts.path);    
   if (req.method == 'POST' && url_parts.path == '/service/pokemon/substore/muon/record/xyz123') {
       //console.log('mockNucleusApi POST /service/pokemon/substore/muon');
       
       var callback = function(body) {
            if (! body) {
                  res.writeHead(400, {'Content-Type': 'application/json'});
                  res.write(JSON.stringify({message: "no post body"}) );
                  res.end();    
              } else {
                   console.log('mockNucleusApi POST /service/pokemon/substore/muon body=' + body);
                  res.writeHead(201, {'Content-Type': 'application/json'});
                  res.write(JSON.stringify({message: "created"}) );
                  res.end(); 
              }
       }
       getBody(req, callback);
       
      
   } else if (req.method == 'GET' && url_parts.path == '/service/pokemon/substore/muon/record/xyz123') {
      //console.log('mockDockerApi GET /service/pokemon/substore/muon');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({message: "test"}) );
      res.end();        
       
   } else if (req.method == 'GET' && url_parts.path == '/service/pokemon/substore/muon') {
      //console.log('mockDockerApi GET /service/pokemon/substore/muon');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({message: "test"}) );
      res.end();        
       
   } else {
      //console.log('mockDockerApi, no match for ' + url_parts.path);
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({error: "no record found matching " + url_parts.path}) );      
      res.end();  
       
   }
   
}

function httpStartupComplete(port) {
    console.log("starting mock nucleus server on port " + port);
}



//create mock remote docker API  
http.createServer(apiHandler).listen(port, httpStartupComplete(port) );







function getBody(request, callback) {
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            if (body.length > 1e6)
                req.connection.destroy();
        });
        request.on('end', function () {
            var post = body;
            callback(post);
        });
    }
}











/*
function nucleusJson() {

 return [
   {
      "Image" : "sp_platform/uber-any:latest",
      "Status" : "Up 7 minutes",
      "Id" : "cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5",
      "provides" : [],
      "Names" : [
         "/cell-simplenode1"
      ],
      "Command" : "/bin/sh -c /spaas/bin/run.sh",
      "Ports" : [
         {
            "PublicPort" : 8080,
            "Type" : "tcp"
         }
      ],
      "id" : "cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5",
      "links" : [
         {
            "href" : "http://172.17.0.2:8080/container/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5",
            "rel" : "self"
         },
         {
            "rel" : "stdout",
            "href" : "http://172.17.0.2:8080/container/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5/stdout"
         },
         {
            "rel" : "stderr",
            "href" : "http://172.17.0.2:8080/container/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5/stderr"
         }
      ],
      "inspection" : {
         "HostnamePath" : "/var/lib/docker/containers/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5/hostname",
         "Driver" : "aufs",
         "Image" : "6b4605d1512f6a2aa01a593a6f3a96335a4b5736a7e2f6168741d36a30755f80",
         "ResolvConfPath" : "/var/lib/docker/containers/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5/resolv.conf",
         "State" : {
            "FinishedAt" : "0001-01-01T00:00:00Z",
            "ExitCode" : 0,
            "Ghost" : false,
            "Pid" : 51719,
            "StartedAt" : "2014-06-15T16:34:15.039434308Z",
            "Running" : true
         },
         "Created" : "2014-06-15T16:34:14.979141192Z",
         "Name" : "/cell-simplenode1",
         "Volumes" : {},
         "ExecDriver" : "native-0.1",
         "Path" : "/bin/sh",
         "VolumesRW" : {},
         "HostsPath" : "/var/lib/docker/containers/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5/hosts",
         "NetworkSettings" : {
            "Gateway" : "172.17.42.1",
            "PortMapping" : null,
            "Bridge" : "docker0",
            "IPPrefixLen" : 16,
            "Ports" : {
               "8080/tcp" : null
            },
            "IPAddress" : "172.17.0.21"
         },
         "HostConfig" : {
            "Privileged" : false,
            "PortBindings" : null,
            "PublishAllPorts" : false,
            "ContainerIDFile" : "",
            "LxcConf" : null,
            "Links" : null,
            "Binds" : null
         },
         "Config" : {
            "Domainname" : "",
            "CpuShares" : 0,
            "VolumesFrom" : "",
            "AttachStderr" : false,
            "Volumes" : null,
            "PortSpecs" : null,
            "Image" : "sp_platform/uber-any",
            "StdinOnce" : false,
            "Dns" : null,
            "Env" : [
               "DNSHOST=simplenode.muon.cistechfutures.net",
               "GIT_REPO_URL=https://github.com/fuzzy-logic/simplenode.git",
               "sp_proxy_PORT=8888",
               "sp_proxy_HOST=172.17.0.8",
               "sp_proxy_URL=172.17.0.8:8888",
               "HOME=/",
               "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "MemorySwap" : 0,
            "Tty" : false,
            "WorkingDir" : "/spaas",
            "Hostname" : "cc881d67bf8c",
            "Memory" : 0,
            "Cmd" : null,
            "NetworkDisabled" : false,
            "AttachStdout" : false,
            "Entrypoint" : [
               "/bin/sh",
               "-c",
               "/spaas/bin/run.sh"
            ],
            "OpenStdin" : false,
            "User" : "",
            "AttachStdin" : false,
            "ExposedPorts" : {
               "8080/tcp" : {}
            },
            "OnBuild" : null
         },
         "Args" : [
            "-c",
            "/spaas/bin/run.sh"
         ],
         "ID" : "cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5"
      },
      "Created" : 1402850054
   },
     
    
     
     
     
   {
      "Image" : "sp_platform/uber-any:latest",
      "Status" : "Up 7 minutes",
      "Id" : "cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5",
      "provides" : [],
      "Names" : [
         "/cell-simplenode2"
      ],
      "Command" : "/bin/sh -c /spaas/bin/run.sh",
      "Ports" : [
         {
            "PublicPort" : 8080,
            "Type" : "tcp"
         }
      ],
      "id" : "cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5",
      "links" : [
         {
            "href" : "http://172.17.0.2:8080/container/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5",
            "rel" : "self"
         },
         {
            "rel" : "stdout",
            "href" : "http://172.17.0.2:8080/container/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5/stdout"
         },
         {
            "rel" : "stderr",
            "href" : "http://172.17.0.2:8080/container/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5/stderr"
         }
      ],
      "inspection" : {
         "HostnamePath" : "/var/lib/docker/containers/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5/hostname",
         "Driver" : "aufs",
         "Image" : "6b4605d1512f6a2aa01a593a6f3a96335a4b5736a7e2f6168741d36a30755f80",
         "ResolvConfPath" : "/var/lib/docker/containers/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5/resolv.conf",
         "State" : {
            "FinishedAt" : "0001-01-01T00:00:00Z",
            "ExitCode" : 0,
            "Ghost" : false,
            "Pid" : 51719,
            "StartedAt" : "2014-06-15T16:34:15.039434308Z",
            "Running" : true
         },
         "Created" : "2014-06-15T16:34:14.979141192Z",
         "Name" : "/cell-simplenode2",
         "Volumes" : {},
         "ExecDriver" : "native-0.1",
         "Path" : "/bin/sh",
         "VolumesRW" : {},
         "HostsPath" : "/var/lib/docker/containers/cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5/hosts",
         "NetworkSettings" : {
            "Gateway" : "172.17.42.1",
            "PortMapping" : null,
            "Bridge" : "docker0",
            "IPPrefixLen" : 16,
            "Ports" : {
               "8080/tcp" : null
            },
            "IPAddress" : "172.17.0.22"
         },
         "HostConfig" : {
            "Privileged" : false,
            "PortBindings" : null,
            "PublishAllPorts" : false,
            "ContainerIDFile" : "",
            "LxcConf" : null,
            "Links" : null,
            "Binds" : null
         },
         "Config" : {
            "Domainname" : "",
            "CpuShares" : 0,
            "VolumesFrom" : "",
            "AttachStderr" : false,
            "Volumes" : null,
            "PortSpecs" : null,
            "Image" : "sp_platform/uber-any",
            "StdinOnce" : false,
            "Dns" : null,
            "Env" : [
               "DNSHOST=simplenode.muon.cistechfutures.net",
               "GIT_REPO_URL=https://github.com/fuzzy-logic/simplenode.git",
               "sp_proxy_PORT=8888",
               "sp_proxy_HOST=172.17.0.8",
               "sp_proxy_URL=172.17.0.8:8888",
               "HOME=/",
               "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "MemorySwap" : 0,
            "Tty" : false,
            "WorkingDir" : "/spaas",
            "Hostname" : "cc881d67bf8c",
            "Memory" : 0,
            "Cmd" : null,
            "NetworkDisabled" : false,
            "AttachStdout" : false,
            "Entrypoint" : [
               "/bin/sh",
               "-c",
               "/spaas/bin/run.sh"
            ],
            "OpenStdin" : false,
            "User" : "",
            "AttachStdin" : false,
            "ExposedPorts" : {
               "8080/tcp" : {}
            },
            "OnBuild" : null
         },
         "Args" : [
            "-c",
            "/spaas/bin/run.sh"
         ],
         "ID" : "cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5"
      },
      "Created" : 1402850054
   }
];   
    
}


*/













