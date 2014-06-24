var http = require('http');
var url = require('url');

var mockDockerPort = process.env.SP_DOCKER_PORT || 14321;
var mockNucleusPort = process.env.SP_NUCLEUS_PORT || 18080;

//create mock remote docker API  
http.createServer(dockerApiHandler).listen(mockDockerPort, function() {
    console.log("starting mock docker api server on port " + mockDockerPort);
} );


/*
http.createServer(nulcleusApiHandler).listen(mockNucleusPort, function() {
    console.log("starting mock nucleus api server on port " + mockNucleusPort);
} );
*/


exports.dockerContainersListJson = dockerContainersListJson;

function dockerApiHandler(req, res) { 
   var url_parts = url.parse(req.url);
   console.log('dockerApiHandler ' + url_parts.path);    
   if (url_parts.path == '/containers/json') {
      console.log('mockDockerApi GET /containers/json writing dockerContainersListJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(dockerContainersListJson()) );
      res.end(); 
   } else if (req.method == 'GET' && url_parts.path == '/containers/b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a/json') {
      console.log('mockDockerApi, writing dockerContainerJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(dockerContainerJson()) );
      res.end();         
   } else if (req.method == 'GET' && url_parts.path == '/containers/simplenodexyz123/json') {
      console.log('mockDockerApi, writing dockerContainerJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(simpleContainerJson()) );
      res.end();         
   } else if (req.method == 'GET' && url_parts.path == '/containers/nucleusxyz123/json') {
      console.log('mockDockerApi, writing dockerContainerJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(nucleusContainerJson()) );
      res.end();         
   } else if (req.method == 'GET' && url_parts.path == '/containers/gnsxyz123/json') {
      console.log('mockDockerApi, writing dockerContainerJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(gnsContainerJson()) );
      res.end();         
   } else if (req.method == 'POST' && url_parts.path == '/images/create?fromImage=foobarImage') { 
     console.log('mockDockerApi, replying 201');
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({Id: 'xyz123'}) );
      res.end(); 
   }  else if (req.method == 'POST' && url_parts.path == '/containers/create?name=simplenode') { 
     console.log('mockDockerApi, replying 201');
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({Id: 'simplenodexyz123'}) );
      res.end(); 
   } else if (req.method == 'POST' && url_parts.path == '/containers/create?name=nucleus') { 
     console.log('mockDockerApi, replying 201');
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({Id: 'nucleusxyz123'}) );
      res.end(); 
   } else if (req.method == 'POST' && url_parts.path == '/containers/create?name=gns') { 
     console.log('mockDockerApi, replying 201');
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({Id: 'gnsxyz123'}) );
      res.end(); 
   } else if (req.method == 'POST' && url_parts.path == '/containers/simplenodexyz123/start') { 
     console.log('mockDockerApi, replying 204');
      res.writeHead(204, {'Content-Type': 'application/json'});
      res.write("{Id: 'simplenodexyz123', Env: ['blah=foo','floo=kroo']}" );
      res.end(); 
   }   else if (req.method == 'POST' && url_parts.path == '/containers/gnsxyz123/start') { 
     console.log('mockDockerApi, replying 204');
      res.writeHead(204, {'Content-Type': 'application/json'});
      res.write("{Id: 'gnsxyz123', Env: ['blah=foo','floo=kroo']}" );
      res.end(); 
   } else if (req.method == 'POST' && url_parts.path == '/containers/nucleusxyz123/start') { 
     console.log('mockDockerApi, replying 204');
      res.writeHead(204, {'Content-Type': 'application/json'});
      res.write("{Id: 'nucleusxyz123', Env: ['blah=foo','floo=kroo']}" );
      res.end(); 
   }  else if (req.method == 'POST' && url_parts.path == '/containers/xyz123/kill') { 
     console.log('mockDockerApi, replying 204');
      res.writeHead(24, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({Id: 'xyz123', message: 'containter stopped'}) );
      res.end(); 
   } else if (req.method == 'DELETE' && url_parts.path == '/containers/xyz123') { 
     console.log('mockDockerApi, replying 204');
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({Id: 'xyz123', message: 'container destroyed'}) );
      res.end(); 
   } else {
      console.log('mockDockerApi, no match for ' + url_parts.path);
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({error: "no record found matching " + url_parts.path}) );      
      res.end();  
       
   }
   
}





function dockerContainersListJson() {
    
    return [
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 22
         },
         {
            "Type" : "tcp",
            "PrivatePort" : 8087
         },
         {
            "Type" : "tcp",
            "PrivatePort" : 8098
         }
      ],
      "Command" : "/usr/bin/supervisord",
      "Names" : [
         "/sp-riak_node"
      ],
      "Id" : "fa2fa401397c102ae556ca2715f194a587f6a01bdf92e2112e8038b8f7b9afbb",
      "Status" : "Up 39 minutes",
      "Created" : 1403274927,
      "Image" : "sp_platform/spi_riak_node:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8080
         }
      ],
      "Command" : "/bin/sh -c /run.sh /sbin/my_init",
      "Names" : [
         "/sp-riak_expressor"
      ],
      "Id" : "04e20287aa7b3f9b1ae3817975c87b54a9015c82c672b4b738f5aad2d681d6cc",
      "Status" : "Up 39 minutes",
      "Created" : 1403274925,
      "Image" : "sp_platform/spi_riak_expressor:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8080
         }
      ],
      "Command" : "/bin/sh -c /run.sh /sbin/my_init",
      "Names" : [
         "/sp-stateless_expressor"
      ],
      "Id" : "742b034f29f76e4e9bff26eb45b148f9f2fd3f22ac4ef6be27fc709e95714dc6",
      "Status" : "Up 39 minutes",
      "Created" : 1403274924,
      "Image" : "sp_platform/spi_stateless_expressor:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8080
         }
      ],
      "Command" : "/bin/sh -c /run.sh /sbin/my_init",
      "Names" : [
         "/sp-cell_expressor"
      ],
      "Id" : "5edd83f733e46ebe86d2010cc8dec281ba3ca87296f5fb0df8fa1913da49bbf4",
      "Status" : "Up 39 minutes",
      "Created" : 1403274923,
      "Image" : "sp_platform/spi_cell_expressor:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8888
         }
      ],
      "Command" : "/bin/sh -c '/spaas/nodejs/bin/node app.js'",
      "Names" : [
         "/sp-gns"
      ],
      "Id" : "e6ae6c5d354fe87bb5897baead37b5f54040ec001dd1408ec12681f26212eff2",
      "Status" : "Up 39 minutes",
      "Created" : 1403274922,
      "Image" : "sp_platform/spi_gns:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8080
         }
      ],
      "Command" : "/bin/sh -c '/bin/sh /spaas/project/run.sh'",
      "Names" : [
         "/sp-nucleus"
      ],
      "Id" : "364ea3d9fccd2080b8393baf0bc60bf4d381a96aac268e9f50f1d66153173354",
      "Status" : "Up 39 minutes",
      "Created" : 1403274921,
      "Image" : "sp_platform/spi_nucleus:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8888,
            "PublicPort" : 80,
            "IP" : "0.0.0.0"
         }
      ],
      "Command" : "/bin/sh -c '/spaas/nodejs/bin/node app.js'",
      "Names" : [
         "/sp-sp_proxy"
      ],
      "Id" : "b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a",
      "Status" : "Up 39 minutes",
      "Created" : 1403274920,
      "Image" : "sp_platform/spi_sp_proxy:latest"
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PrivatePort" : 8080
         }
      ],
      "Command" : "/bin/sh -c /run.sh /sbin/my_init",
      "Names" : [
         "/sp-control_plane"
      ],
      "Id" : "cdcd5e8468579484e455cb3877c50cb99bffe4b475107b97ce2d0eb3d86eaaab",
      "Status" : "Up 39 minutes",
      "Created" : 1403274909,
      "Image" : "sp_platform/spi_control_plane:latest"
   }
];
}












function gnsContainerJson() {
    
    return {
   "NetworkSettings" : {
      "Ports" : {
         "8888/tcp" : [
            {
               "HostIp" : "0.0.0.0",
               "HostPort" : "80"
            }
         ]
      },
      "IPPrefixLen" : 16,
      "PortMapping" : null,
      "IPAddress" : "172.17.0.81",
      "Bridge" : "docker0",
      "Gateway" : "172.17.42.1"
   },
   "ProcessLabel" : "",
   "VolumesRW" : {},
   "State" : {
      "Pid" : 4756,
      "Paused" : false,
      "FinishedAt" : "0001-01-01T00:00:00Z",
      "ExitCode" : 0,
      "StartedAt" : "2014-06-20T14:35:20.312395668Z",
      "Running" : true
   },
   "HostsPath" : "/vol1/var/lib/docker/containers/b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a/hosts",
   "Config" : {
      "Entrypoint" : [
         "/bin/sh",
         "-c",
         "/spaas/nodejs/bin/node app.js"
      ],
      "User" : "",
      "ExposedPorts" : {
         "8888/tcp" : {}
      },
      "Cmd" : null,
      "Cpuset" : "",
      "MemorySwap" : 0,
      "AttachStdin" : false,
      "AttachStderr" : false,
      "CpuShares" : 0,
      "OpenStdin" : false,
      "Volumes" : null,
      "Hostname" : "b87af061730c",
      "PortSpecs" : null,
      "Tty" : false,
      "Env" : [
         "sp-control-plane_PORT=8080",
         "sp-control-plane_HOST=172.17.0.58",
         "sp_proxy_PORT=8888",
         "sp_proxy_HOST=172.17.0.2",
         "sp_proxy_URL=172.17.0.2:8888",
         "HOME=/",
         "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
         "SP_REGISTRY_HOST=172.17.0.5"
      ],
      "Image" : "sp_platform/spi_sp_proxy",
      "StdinOnce" : false,
      "Domainname" : "",
      "WorkingDir" : "/proxy",
      "Memory" : 0,
      "NetworkDisabled" : false,
      "AttachStdout" : false,
      "OnBuild" : null
   },
   "MountLabel" : "",
   "HostnamePath" : "/vol1/var/lib/docker/containers/b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a/hostname",
   "ExecDriver" : "native-0.2",
   "Args" : [
      "-c",
      "/spaas/nodejs/bin/node app.js"
   ],
   "Volumes" : {},
   "Id" : "b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a",
   "HostConfig" : {
      "Binds" : null,
      "NetworkMode" : "",
      "Privileged" : true,
      "ContainerIDFile" : "",
      "DnsSearch" : null,
      "Links" : null,
      "LxcConf" : null,
      "PortBindings" : {
         "8888/tcp" : [
            {
               "HostIp" : "0.0.0.0",
               "HostPort" : "80"
            }
         ]
      },
      "VolumesFrom" : null,
      "PublishAllPorts" : false,
      "Dns" : null
   },
   "Image" : "ec2ca2dceb350a65876f93ae5c90c61743775a56e0a710212916dd3d23137bb5",
   "ResolvConfPath" : "/etc/resolv.conf",
   "Created" : "2014-06-20T14:35:20.186838452Z",
   "Path" : "/bin/sh",
   "Driver" : "aufs",
   "Name" : "/sp-sp_gns"
};
}
    
    
    
    
    
    
    
    
    
    
    

function gnsContainerJson() {
    
    return {
   "NetworkSettings" : {
      "Ports" : {
         "8888/tcp" : [
            {
               "HostIp" : "0.0.0.0",
               "HostPort" : "80"
            }
         ]
      },
      "IPPrefixLen" : 16,
      "PortMapping" : null,
      "IPAddress" : "172.17.0.81",
      "Bridge" : "docker0",
      "Gateway" : "172.17.42.1"
   },
   "ProcessLabel" : "",
   "VolumesRW" : {},
   "State" : {
      "Pid" : 4756,
      "Paused" : false,
      "FinishedAt" : "0001-01-01T00:00:00Z",
      "ExitCode" : 0,
      "StartedAt" : "2014-06-20T14:35:20.312395668Z",
      "Running" : true
   },
   "HostsPath" : "/vol1/var/lib/docker/containers/b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a/hosts",
   "Config" : {
      "Entrypoint" : [
         "/bin/sh",
         "-c",
         "/spaas/nodejs/bin/node app.js"
      ],
      "User" : "",
      "ExposedPorts" : {
         "8888/tcp" : {}
      },
      "Cmd" : null,
      "Cpuset" : "",
      "MemorySwap" : 0,
      "AttachStdin" : false,
      "AttachStderr" : false,
      "CpuShares" : 0,
      "OpenStdin" : false,
      "Volumes" : null,
      "Hostname" : "b87af061730c",
      "PortSpecs" : null,
      "Tty" : false,
      "Env" : [
         "sp-control-plane_PORT=8080",
         "sp-control-plane_HOST=172.17.0.58",
         "sp_proxy_PORT=8888",
         "sp_proxy_HOST=172.17.0.2",
         "sp_proxy_URL=172.17.0.2:8888",
         "HOME=/",
         "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
         "SP_REGISTRY_HOST=172.17.0.5"
      ],
      "Image" : "sp_platform/spi_sp_proxy",
      "StdinOnce" : false,
      "Domainname" : "",
      "WorkingDir" : "/proxy",
      "Memory" : 0,
      "NetworkDisabled" : false,
      "AttachStdout" : false,
      "OnBuild" : null
   },
   "MountLabel" : "",
   "HostnamePath" : "/vol1/var/lib/docker/containers/b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a/hostname",
   "ExecDriver" : "native-0.2",
   "Args" : [
      "-c",
      "/spaas/nodejs/bin/node app.js"
   ],
   "Volumes" : {},
   "Id" : "b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a",
   "HostConfig" : {
      "Binds" : null,
      "NetworkMode" : "",
      "Privileged" : true,
      "ContainerIDFile" : "",
      "DnsSearch" : null,
      "Links" : null,
      "LxcConf" : null,
      "PortBindings" : {
         "8888/tcp" : [
            {
               "HostIp" : "0.0.0.0",
               "HostPort" : "80"
            }
         ]
      },
      "VolumesFrom" : null,
      "PublishAllPorts" : false,
      "Dns" : null
   },
   "Image" : "ec2ca2dceb350a65876f93ae5c90c61743775a56e0a710212916dd3d23137bb5",
   "ResolvConfPath" : "/etc/resolv.conf",
   "Created" : "2014-06-20T14:35:20.186838452Z",
   "Path" : "/bin/sh",
   "Driver" : "aufs",
   "Name" : "/sp-sp_gns"
};
}
    

function simpleContainerJson() {
    
    return {
   "NetworkSettings" : {
      "Ports" : {
         "8888/tcp" : [
            {
               "HostIp" : "0.0.0.0",
               "HostPort" : "80"
            }
         ]
      },
      "IPPrefixLen" : 16,
      "PortMapping" : null,
      "IPAddress" : "172.17.0.24",
      "Bridge" : "docker0",
      "Gateway" : "172.17.42.1"
   },
   "ProcessLabel" : "",
   "VolumesRW" : {},
   "State" : {
      "Pid" : 4756,
      "Paused" : false,
      "FinishedAt" : "0001-01-01T00:00:00Z",
      "ExitCode" : 0,
      "StartedAt" : "2014-06-20T14:35:20.312395668Z",
      "Running" : true
   },
   "HostsPath" : "/vol1/var/lib/docker/containers/b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a/hosts",
   "Config" : {
      "Entrypoint" : [
         "/bin/sh",
         "-c",
         "/spaas/nodejs/bin/node app.js"
      ],
      "User" : "",
      "ExposedPorts" : {
         "8888/tcp" : {}
      },
      "Cmd" : null,
      "Cpuset" : "",
      "MemorySwap" : 0,
      "AttachStdin" : false,
      "AttachStderr" : false,
      "CpuShares" : 0,
      "OpenStdin" : false,
      "Volumes" : null,
      "Hostname" : "b87af061730c",
      "PortSpecs" : null,
      "Tty" : false,
      "Env" : [
         "sp-control-plane_PORT=8080",
         "sp-control-plane_HOST=172.17.0.58",
         "sp_proxy_PORT=8888",
         "sp_proxy_HOST=172.17.0.2",
         "sp_proxy_URL=172.17.0.2:8888",
         "HOME=/",
         "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
         "SP_REGISTRY_HOST=172.17.0.5"
      ],
      "Image" : "sp_platform/spi_sp_proxy",
      "StdinOnce" : false,
      "Domainname" : "",
      "WorkingDir" : "/proxy",
      "Memory" : 0,
      "NetworkDisabled" : false,
      "AttachStdout" : false,
      "OnBuild" : null
   },
   "MountLabel" : "",
   "HostnamePath" : "/vol1/var/lib/docker/containers/b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a/hostname",
   "ExecDriver" : "native-0.2",
   "Args" : [
      "-c",
      "/spaas/nodejs/bin/node app.js"
   ],
   "Volumes" : {},
   "Id" : "b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a",
   "HostConfig" : {
      "Binds" : null,
      "NetworkMode" : "",
      "Privileged" : true,
      "ContainerIDFile" : "",
      "DnsSearch" : null,
      "Links" : null,
      "LxcConf" : null,
      "PortBindings" : {
         "8888/tcp" : [
            {
               "HostIp" : "0.0.0.0",
               "HostPort" : "80"
            }
         ]
      },
      "VolumesFrom" : null,
      "PublishAllPorts" : false,
      "Dns" : null
   },
   "Image" : "ec2ca2dceb350a65876f93ae5c90c61743775a56e0a710212916dd3d23137bb5",
   "ResolvConfPath" : "/etc/resolv.conf",
   "Created" : "2014-06-20T14:35:20.186838452Z",
   "Path" : "/bin/sh",
   "Driver" : "aufs",
   "Name" : "/sp-simplenode"
};
}
    
    
    
    
    
    
    
    

function nucleusContainerJson() {
    
    return {
   "NetworkSettings" : {
      "Ports" : {
         "8888/tcp" : [
            {
               "HostIp" : "0.0.0.0",
               "HostPort" : "80"
            }
         ]
      },
      "IPPrefixLen" : 16,
      "PortMapping" : null,
      "IPAddress" : "172.17.0.36",
      "Bridge" : "docker0",
      "Gateway" : "172.17.42.1"
   },
   "ProcessLabel" : "",
   "VolumesRW" : {},
   "State" : {
      "Pid" : 4756,
      "Paused" : false,
      "FinishedAt" : "0001-01-01T00:00:00Z",
      "ExitCode" : 0,
      "StartedAt" : "2014-06-20T14:35:20.312395668Z",
      "Running" : true
   },
   "HostsPath" : "/vol1/var/lib/docker/containers/b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a/hosts",
   "Config" : {
      "Entrypoint" : [
         "/bin/sh",
         "-c",
         "/spaas/nodejs/bin/node app.js"
      ],
      "User" : "",
      "ExposedPorts" : {
         "8888/tcp" : {}
      },
      "Cmd" : null,
      "Cpuset" : "",
      "MemorySwap" : 0,
      "AttachStdin" : false,
      "AttachStderr" : false,
      "CpuShares" : 0,
      "OpenStdin" : false,
      "Volumes" : null,
      "Hostname" : "b87af061730c",
      "PortSpecs" : null,
      "Tty" : false,
      "Env" : [
         "sp-control-plane_PORT=8080",
         "sp-control-plane_HOST=172.17.0.58",
         "sp_proxy_PORT=8888",
         "sp_proxy_HOST=172.17.0.2",
         "sp_proxy_URL=172.17.0.2:8888",
         "HOME=/",
         "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
         "SP_REGISTRY_HOST=172.17.0.5"
      ],
      "Image" : "sp_platform/spi_sp_proxy",
      "StdinOnce" : false,
      "Domainname" : "",
      "WorkingDir" : "/proxy",
      "Memory" : 0,
      "NetworkDisabled" : false,
      "AttachStdout" : false,
      "OnBuild" : null
   },
   "MountLabel" : "",
   "HostnamePath" : "/vol1/var/lib/docker/containers/b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a/hostname",
   "ExecDriver" : "native-0.2",
   "Args" : [
      "-c",
      "/spaas/nodejs/bin/node app.js"
   ],
   "Volumes" : {},
   "Id" : "b87af061730ca19a8e9452788c8f17918f2ec46e4086e3750c1b7a2b17fc708a",
   "HostConfig" : {
      "Binds" : null,
      "NetworkMode" : "",
      "Privileged" : true,
      "ContainerIDFile" : "",
      "DnsSearch" : null,
      "Links" : null,
      "LxcConf" : null,
      "PortBindings" : {
         "8888/tcp" : [
            {
               "HostIp" : "0.0.0.0",
               "HostPort" : "80"
            }
         ]
      },
      "VolumesFrom" : null,
      "PublishAllPorts" : false,
      "Dns" : null
   },
   "Image" : "ec2ca2dceb350a65876f93ae5c90c61743775a56e0a710212916dd3d23137bb5",
   "ResolvConfPath" : "/etc/resolv.conf",
   "Created" : "2014-06-20T14:35:20.186838452Z",
   "Path" : "/bin/sh",
   "Driver" : "aufs",
   "Name" : "/sp-nucleus"
};
}




