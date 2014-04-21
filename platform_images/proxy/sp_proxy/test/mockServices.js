var http = require('http');
var url = require('url');

function mockEndPointHandler(req, res) {
   res.writeHead(200, {'Content-Type': 'text/plain'});
   res.write('mockEndPointHandler: Hello, World!');
   res.end();
}

function mockRegistryHandler(req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   //res.write(JSON.stringify({name: 'localhost', port: '3001', hosts: ['192.168.0.1:3000', '192.168.0.2:3001']}) );
   res.write(JSON.stringify({host: 'localhost', port: '3001'}));
   res.end();
}


function mockDockerHandler(req, res) {
    var requestUrl = url.parse(req.url, true, false);
    var serviceName = requestUrl.path.split('/')[2];   
    console.log('mockDockerHandler() url path: %s, service: %s', requestUrl.path, serviceName );
    if (serviceName == 'sp-control_plane') {
       res.writeHead(200, {'Content-Type': 'application/json'});
       res.write(JSON.stringify(dockerJson()));
       res.end(); 
    } else {
       res.writeHead(200, {'Content-Type': 'application/json'});
       res.write(JSON.stringify({message: "error no matching service name in mockDockerHandler()"}));
       res.end();
        
    }
    
  
}


function httpStartupComplete(port) {
    console.log("starting http server on port " + port);
}



//create mock endpoint service to test proxy with 
http.createServer(mockEndPointHandler).listen(3001, httpStartupComplete(3001));

//create mock registry
http.createServer(mockRegistryHandler).listen(4333, httpStartupComplete(4333));

//create mock docker registry
http.createServer(mockDockerHandler).listen(4321, httpStartupComplete(4321));


function dockerJson() {
    
    
 return {
   "NetworkSettings" : {
      "Ports" : {
         "3001/tcp" : null
      },
      "IPPrefixLen" : 16,
      "PortMapping" : null,
      "Bridge" : "docker0",
      "IPAddress" : "localhost",
      "Gateway" : "172.17.42.1"
   },
   "ID" : "827d255e73a3cb6e2a88aed86fdd547bebe2a28dd7664bff5a7c37a09cde400a",
   "VolumesRW" : {},
   "HostsPath" : "/var/lib/docker/containers/827d255e73a3cb6e2a88aed86fdd547bebe2a28dd7664bff5a7c37a09cde400a/hosts",
   "State" : {
      "Pid" : 901,
      "FinishedAt" : "2014-04-12T04:44:19.54269833Z",
      "ExitCode" : 0,
      "StartedAt" : "2014-04-12T04:44:19.553303309Z",
      "Ghost" : false,
      "Running" : true
   },
   "Config" : {
      "Entrypoint" : [
         "/bin/sh",
         "-c",
         "/run.sh"
      ],
      "User" : "",
      "ExposedPorts" : {
         "3001/tcp" : {}
      },
      "VolumesFrom" : "",
      "Cmd" : [
         "/bin/sh",
         "-c",
         "#(nop) ADD file:ebd9bdcd07830cdb70eb14d316b47a41908e307d46b0fba2d6fce0a85d7f22c4 in /"
      ],
      "Dns" : null,
      "MemorySwap" : 0,
      "AttachStdin" : false,
      "CpuShares" : 0,
      "AttachStderr" : false,
      "OpenStdin" : false,
      "Volumes" : null,
      "Hostname" : "827d255e73a3",
      "PortSpecs" : null,
      "Image" : "sp_platform/spi_control_plane",
      "Tty" : false,
      "Env" : [
         "HOME=/root",
         "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
         "PROVIDES=sp-control-plane:8080"
      ],
      "StdinOnce" : false,
      "Domainname" : "",
      "WorkingDir" : "",
      "NetworkDisabled" : false,
      "Memory" : 0,
      "OnBuild" : null,
      "AttachStdout" : false
   },
   "HostnamePath" : "/var/lib/docker/containers/827d255e73a3cb6e2a88aed86fdd547bebe2a28dd7664bff5a7c37a09cde400a/hostname",
   "ExecDriver" : "native-0.1",
   "Args" : [
      "-c",
      "/run.sh",
      "/bin/sh",
      "-c",
      "#(nop) ADD file:ebd9bdcd07830cdb70eb14d316b47a41908e307d46b0fba2d6fce0a85d7f22c4 in /"
   ],
   "Volumes" : {},
   "HostConfig" : {
      "Links" : null,
      "PortBindings" : {
         "8080/tcp" : null
      },
      "LxcConf" : [],
      "Binds" : null,
      "PublishAllPorts" : false,
      "Privileged" : false,
      "ContainerIDFile" : ""
   },
   "Image" : "1ea9a44d1b44bd42f8818ee30e5bdfe278d3e279c0ff34bb0e15349b743b086a",
   "ResolvConfPath" : "/etc/resolv.conf",
   "Path" : "/bin/sh",
   "Created" : "2014-04-12T03:55:41.018591672Z",
   "Driver" : "aufs",
   "Name" : "/sp-control_plane"
};   
    
    
    
    
}