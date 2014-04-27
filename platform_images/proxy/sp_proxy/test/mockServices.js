var http = require('http');
var url = require('url');

mockRegistryPort = 18080;
mockEndpointPort = 13001;
mockCorePlatformEndpointPort = 18081;
mockDockerApiPort = 14321;

function mockSimpleServiceHandler(req, res) {
    var requestUrl = url.parse(req.url, true, false);
    console.log('mockSimpleServiceHandler() url path: %s', requestUrl.path );
    if (requestUrl.path == '/blah/some/path') {
       res.writeHead(200, {'Content-Type': 'text/plain'});
       res.write('mockSimpleServiceHandler: Hello, World!');
       res.end();
    } else {
       res.writeHead(404, {'Content-Type': 'text/plain'});
       res.write(JSON.stringify({message: "no mapping for /path: " + requestUrl.path}));
       res.end();  
        
    }
}

function mockCorePlatformHandler(req, res) {
   var requestUrl = url.parse(req.url, true, false);
   console.log('mockCorePlatformHandler() url path: %s', requestUrl.path );
    if (requestUrl.path == '/container') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({status: "ok", message: "this is a mock control-plane response", service_name: 'sp-control_plane'}));
        res.end(); 
        
   } else {
       res.writeHead(404, {'Content-Type': 'application/json'});
       res.write(JSON.stringify({message: "no mapping for /path: " + requestUrl.path}));
       res.end(); 
   }

}

function mockRegistryHandler(req, res) { 
    var requestUrl = url.parse(req.url, true, false);  
    var servicename = requestUrl.path.split('/')[2];
     console.log('mockRegistryHandler() url path: %s servicename: %s', requestUrl.path, servicename);
    if (servicename == 'simpleservice') {
       res.writeHead(200, {'Content-Type': 'application/json'});
       res.write(JSON.stringify({host: 'localhost', port: mockEndpointPort}) );
       res.end(); 
    }  else {
       res.writeHead(404, {'Content-Type': 'application/json'});
       res.write(JSON.stringify({message: "error no matching service name in mockDockerHandler()"}));
       res.end();
        
    }
}


function mockDockerApiHandler(req, res) {
    var requestUrl = url.parse(req.url, true, false);
    var serviceName = requestUrl.path.split('/')[2];   
    console.log('mockDockerApiHandler() url path: %s, service: %s', requestUrl.path, serviceName );
    if (serviceName == 'sp-control_plane') {
       res.writeHead(200, {'Content-Type': 'application/json'});
       res.write(JSON.stringify(dockerApiControlPlaneJson()));
       res.end(); 
    } else if (serviceName == 'does-not-exist') { // test text/plain error message
        res.writeHead(404, {'Content-Type': 'text/plain'});
       res.write("no service " + serviceName);
       res.end(); 
    } else if (serviceName == 'simpleservice') {
        res.writeHead(200, {'Content-Type': 'application/json'});
       res.write(JSON.stringify(dockerApiUserServiceJson()));
       res.end(); 
    } else if (serviceName == 'sp-gns') {
        res.writeHead(200, {'Content-Type': 'application/json'});
       res.write(JSON.stringify(dockerApiGnsServiceJson()));
       res.end(); 
    } else {
       res.writeHead(404, {'Content-Type': 'application/json'});
       res.write(JSON.stringify({message: "error no matching service " + serviceName + "   in mockDockerHandler()"}));
       res.end();
        
    }
    
  
}


function httpStartupComplete(service, port) {
    console.log("starting %s service on port %s", service, port);
}

//create mock core platfom endpoint service to test proxy with 
http.createServer(mockCorePlatformHandler).listen(mockCorePlatformEndpointPort, httpStartupComplete("mock core service", mockCorePlatformEndpointPort));

//create mock endpoint service to test proxy with 
http.createServer(mockSimpleServiceHandler).listen(mockEndpointPort, httpStartupComplete("mock simplenode", mockEndpointPort));

//create mock registry
http.createServer(mockRegistryHandler).listen(mockRegistryPort, httpStartupComplete("mock registry", mockRegistryPort));

//create mock docker registry
http.createServer(mockDockerApiHandler).listen(mockDockerApiPort, httpStartupComplete("mock docker api", mockDockerApiPort));


function dockerApiControlPlaneJson() {
    
 return {
   "Image" : "1ea9a44d1b44bd42f8818ee30e5bdfe278d3e279c0ff34bb0e15349b743b086a",
   "Name" : "/sp-control_plane",
  
   "NetworkSettings" : {
      "Ports" : {
         "18081/tcp" : null
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
         "18081/tcp" : {}
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
         "18081/tcp" : null
      },
      "LxcConf" : [],
      "Binds" : null,
      "PublishAllPorts" : false,
      "Privileged" : false,
      "ContainerIDFile" : ""
   },
   "ResolvConfPath" : "/etc/resolv.conf",
   "Path" : "/bin/sh",
   "Created" : "2014-04-12T03:55:41.018591672Z",
   "Driver" : "aufs",
}; 
    
}

















function dockerApiUserServiceJson() {
    
 return {
   "Image" : "81c1fd311b44bd42f8818ee30e5bdfe278d3e279c0ff34bb0e15349b743b086a",
   "ResolvConfPath" : "/etc/resolv.conf",
   "Path" : "/bin/sh",
   "Created" : "2014-04-12T03:55:41.018591672Z",
   "Driver" : "aufs",
   "Name" : "/simpleservice",
   "NetworkSettings" : {
      "Ports" : {
         "13001/tcp" : null
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
         "13001/tcp" : null
      },
      "LxcConf" : [],
      "Binds" : null,
      "PublishAllPorts" : false,
      "Privileged" : false,
      "ContainerIDFile" : ""
   }
}; 
    
}




















function dockerApiGnsServiceJson() {
    
 return {
   "Image" : "32c18fba1b44bd42f8818ee30e5bdfe278d3e279c0ff34bb0e15349b743b086a",
   "ResolvConfPath" : "/etc/resolv.conf",
   "Path" : "/bin/sh",
   "Created" : "2014-04-12T03:55:41.018591672Z",
   "Driver" : "aufs",
   "Name" : "/sp-gns",
   "NetworkSettings" : {
      "Ports" : {
         "18080/tcp" : null
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
         "18080/tcp" : {}
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
   }
}; 
    
}
    
