var http = require('http');
 url  = require('url');


var port = 18081;
/*
//  curl -X GET "http://172.17.0.4:8080/service/pokemon?qk=inspection.Config.Env&qv=simplenode.muon.cistechfutures.net"
*/

function apiHandler(req, res) { 
   var url_parts = url.parse(req.url);
   //console.log('url path: ' + url_parts.path);    
   if (url_parts.path == '/service/pokemon?qk=inspection.Config.Env&qv=simplenode.muon.cistechfutures.net') {
      console.log('mockNucleusApi GET /service/pokemon/substore/muon writing nucleusJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(nucleusJson()) );
      res.end(); 
   } else if (url_parts.path == '/service/gene-store/substore/cell') {
      console.log('mockDockerApi, writing phenotypeJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({message: "test"}) );
      res.end();        
       
   } else {
      console.log('mockDockerApi, no match for ' + url_parts.path);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({error: "no record found matching " + url_parts.path}) );      
      res.end();  
       
   }
   
}

function httpStartupComplete(port) {
    console.log("starting mock nucleus server on port " + port);
}



//create mock remote docker API  
http.createServer(apiHandler).listen(port, httpStartupComplete(port) );


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


/*

SAMPLE NUCLEUS RESULT:

[
   {
      "Names" : [
         "/sp-riak_node"
      ],
      "provides" : [
         {
            "port" : "8080",
            "name" : "riak"
         }
      ],
      "Id" : "cf9350042e94f3e27f0eaacee5785af88b0d15aa77b660e0390b37274e66db18",
      "Command" : "/usr/bin/supervisord ",
      "Image" : "sp_platform/spi_riak_node:latest",
      "Status" : "Up 9 minutes",
      "id" : "cf9350042e94f3e27f0eaacee5785af88b0d15aa77b660e0390b37274e66db18",
      "Created" : 1402849931,
      "inspection" : {
         "HostnamePath" : "/var/lib/docker/containers/cf9350042e94f3e27f0eaacee5785af88b0d15aa77b660e0390b37274e66db18/hostname",
         "Driver" : "aufs",
         "ResolvConfPath" : "/var/lib/docker/containers/cf9350042e94f3e27f0eaacee5785af88b0d15aa77b660e0390b37274e66db18/resolv.conf",
         "Image" : "0b288ec8ff6fbdc785a81d045456d65a2864cc6da44880867af70120509c8c79",
         "Name" : "/sp-riak_node",
         "State" : {
            "Running" : true,
            "StartedAt" : "2014-06-15T16:32:11.715971924Z",
            "Pid" : 50738,
            "FinishedAt" : "0001-01-01T00:00:00Z",
            "Ghost" : false,
            "ExitCode" : 0
         },
         "Created" : "2014-06-15T16:32:11.622610328Z",
         "Volumes" : {},
         "ExecDriver" : "native-0.1",
         "Path" : "/usr/bin/supervisord",
         "VolumesRW" : {},
         "HostsPath" : "/var/lib/docker/containers/cf9350042e94f3e27f0eaacee5785af88b0d15aa77b660e0390b37274e66db18/hosts",
         "HostConfig" : {
            "ContainerIDFile" : "",
            "LxcConf" : null,
            "Links" : null,
            "Binds" : null,
            "PortBindings" : null,
            "PublishAllPorts" : false,
            "Privileged" : false
         },
         "NetworkSettings" : {
            "Bridge" : "docker0",
            "PortMapping" : null,
            "Gateway" : "172.17.42.1",
            "IPAddress" : "172.17.0.9",
            "IPPrefixLen" : 16,
            "Ports" : {
               "8087/tcp" : null,
               "8098/tcp" : null,
               "22/tcp" : null
            }
         },
         "Config" : {
            "PortSpecs" : null,
            "Image" : "sp_platform/spi_riak_node",
            "StdinOnce" : false,
            "Dns" : null,
            "Env" : [
               "sp-control-plane_PORT=8080",
               "sp-control-plane_HOST=172.17.0.2",
               "sp_proxy_PORT=8888",
               "sp_proxy_HOST=172.17.0.8",
               "sp_proxy_URL=172.17.0.8:8888",
               "HOME=/",
               "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
               "PROVIDES=riak:8080"
            ],
            "MemorySwap" : 0,
            "Domainname" : "",
            "VolumesFrom" : "",
            "CpuShares" : 0,
            "AttachStderr" : false,
            "Volumes" : null,
            "Entrypoint" : null,
            "OpenStdin" : false,
            "User" : "",
            "AttachStdin" : false,
            "ExposedPorts" : {
               "22/tcp" : {},
               "8087/tcp" : {},
               "8098/tcp" : {}
            },
            "OnBuild" : null,
            "WorkingDir" : "",
            "Tty" : false,
            "Hostname" : "cf9350042e94",
            "Memory" : 0,
            "Cmd" : [
               "/usr/bin/supervisord"
            ],
            "NetworkDisabled" : false,
            "AttachStdout" : false
         },
         "ID" : "cf9350042e94f3e27f0eaacee5785af88b0d15aa77b660e0390b37274e66db18",
         "Args" : []
      },
      "links" : [
         {
            "href" : "http://172.17.0.2:8080/container/cf9350042e94f3e27f0eaacee5785af88b0d15aa77b660e0390b37274e66db18",
            "rel" : "self"
         },
         {
            "rel" : "stdout",
            "href" : "http://172.17.0.2:8080/container/cf9350042e94f3e27f0eaacee5785af88b0d15aa77b660e0390b37274e66db18/stdout"
         },
         {
            "href" : "http://172.17.0.2:8080/container/cf9350042e94f3e27f0eaacee5785af88b0d15aa77b660e0390b37274e66db18/stderr",
            "rel" : "stderr"
         }
      ],
      "Ports" : [
         {
            "Type" : "tcp",
            "PublicPort" : 22
         },
         {
            "PublicPort" : 8087,
            "Type" : "tcp"
         },
         {
            "Type" : "tcp",
            "PublicPort" : 8098
         }
      ]
   },
   {
      "Command" : "/bin/sh -c /run.sh /sbin/my_init",
      "Names" : [
         "/sp-riak_expressor"
      ],
      "provides" : [
         {
            "port" : "8080",
            "name" : "sp-riak-expressor"
         }
      ],
      "Id" : "c97358a3c7bf180ed9b31ccc2d927ce55f7f7e47ca91fe0791da74d6b59a8c04",
      "Status" : "Up 9 minutes",
      "Image" : "sp_platform/spi_riak_expressor:latest",
      "inspection" : {
         "HostConfig" : {
            "PortBindings" : null,
            "PublishAllPorts" : false,
            "Privileged" : false,
            "ContainerIDFile" : "",
            "Binds" : null,
            "LxcConf" : null,
            "Links" : null
         },
         "NetworkSettings" : {
            "IPAddress" : "172.17.0.8",
            "Ports" : {
               "8080/tcp" : null
            },
            "IPPrefixLen" : 16,
            "Bridge" : "docker0",
            "Gateway" : "172.17.42.1",
            "PortMapping" : null
         },
         "VolumesRW" : {},
         "HostsPath" : "/var/lib/docker/containers/c97358a3c7bf180ed9b31ccc2d927ce55f7f7e47ca91fe0791da74d6b59a8c04/hosts",
         "ID" : "c97358a3c7bf180ed9b31ccc2d927ce55f7f7e47ca91fe0791da74d6b59a8c04",
         "Args" : [
            "-c",
            "/run.sh",
            "/sbin/my_init"
         ],
         "Config" : {
            "OpenStdin" : false,
            "Entrypoint" : [
               "/bin/sh",
               "-c",
               "/run.sh"
            ],
            "User" : "",
            "AttachStdin" : false,
            "OnBuild" : null,
            "ExposedPorts" : {
               "8080/tcp" : {}
            },
            "Hostname" : "c97358a3c7bf",
            "Tty" : false,
            "WorkingDir" : "",
            "Memory" : 0,
            "NetworkDisabled" : false,
            "Cmd" : [
               "/sbin/my_init"
            ],
            "AttachStdout" : false,
            "PortSpecs" : null,
            "Image" : "sp_platform/spi_riak_expressor",
            "Dns" : null,
            "StdinOnce" : false,
            "MemorySwap" : 0,
            "Env" : [
               "sp-control-plane_PORT=8080",
               "sp-control-plane_HOST=172.17.0.2",
               "sp_proxy_PORT=8888",
               "sp_proxy_HOST=172.17.0.8",
               "sp_proxy_URL=172.17.0.8:8888",
               "HOME=/root",
               "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
               "PROVIDES=sp-riak-expressor:8080"
            ],
            "Domainname" : "",
            "VolumesFrom" : "",
            "CpuShares" : 0,
            "AttachStderr" : false,
            "Volumes" : null
         },
         "ResolvConfPath" : "/var/lib/docker/containers/c97358a3c7bf180ed9b31ccc2d927ce55f7f7e47ca91fe0791da74d6b59a8c04/resolv.conf",
         "Image" : "17bca80dcb47ed482b6dd976bcb67eddcf5ca75474fa9bd9fcc63c784d53e8fe",
         "Driver" : "aufs",
         "HostnamePath" : "/var/lib/docker/containers/c97358a3c7bf180ed9b31ccc2d927ce55f7f7e47ca91fe0791da74d6b59a8c04/hostname",
         "Path" : "/bin/sh",
         "ExecDriver" : "native-0.1",
         "Volumes" : {},
         "Name" : "/sp-riak_expressor",
         "State" : {
            "Ghost" : false,
            "ExitCode" : 0,
            "FinishedAt" : "0001-01-01T00:00:00Z",
            "Pid" : 50555,
            "StartedAt" : "2014-06-15T16:32:09.388323817Z",
            "Running" : true
         },
         "Created" : "2014-06-15T16:32:09.309843108Z"
      },
      "Created" : 1402849929,
      "links" : [
         {
            "rel" : "self",
            "href" : "http://172.17.0.2:8080/container/c97358a3c7bf180ed9b31ccc2d927ce55f7f7e47ca91fe0791da74d6b59a8c04"
         },
         {
            "rel" : "stdout",
            "href" : "http://172.17.0.2:8080/container/c97358a3c7bf180ed9b31ccc2d927ce55f7f7e47ca91fe0791da74d6b59a8c04/stdout"
         },
         {
            "href" : "http://172.17.0.2:8080/container/c97358a3c7bf180ed9b31ccc2d927ce55f7f7e47ca91fe0791da74d6b59a8c04/stderr",
            "rel" : "stderr"
         }
      ],
      "id" : "c97358a3c7bf180ed9b31ccc2d927ce55f7f7e47ca91fe0791da74d6b59a8c04",
      "Ports" : [
         {
            "PublicPort" : 8080,
            "Type" : "tcp"
         }
      ]
   },
   {
      "inspection" : {
         "State" : {
            "Ghost" : false,
            "ExitCode" : 0,
            "FinishedAt" : "0001-01-01T00:00:00Z",
            "Running" : true,
            "StartedAt" : "2014-06-15T16:32:07.10236429Z",
            "Pid" : 50375
         },
         "Created" : "2014-06-15T16:32:07.047182473Z",
         "Name" : "/sp-stateless_expressor",
         "ExecDriver" : "native-0.1",
         "Volumes" : {},
         "Path" : "/bin/sh",
         "HostnamePath" : "/var/lib/docker/containers/6c20c40aa42c4066b34f8ea3449c16c988ab0bf4c5e1fc44b23797bacf2d10d8/hostname",
         "Driver" : "aufs",
         "Image" : "33deba17bbb4529adeb32df8ee88b4799128d62d1079fc5d0f6ae1ee188dcf58",
         "ResolvConfPath" : "/var/lib/docker/containers/6c20c40aa42c4066b34f8ea3449c16c988ab0bf4c5e1fc44b23797bacf2d10d8/resolv.conf",
         "Config" : {
            "AttachStderr" : false,
            "Volumes" : null,
            "CpuShares" : 0,
            "VolumesFrom" : "",
            "Domainname" : "",
            "MemorySwap" : 0,
            "Env" : [
               "sp-control-plane_PORT=8080",
               "sp-control-plane_HOST=172.17.0.2",
               "sp_proxy_PORT=8888",
               "sp_proxy_HOST=172.17.0.8",
               "sp_proxy_URL=172.17.0.8:8888",
               "HOME=/root",
               "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
               "PROVIDES=sp-stateless-expressor:8080"
            ],
            "Dns" : null,
            "StdinOnce" : false,
            "Image" : "sp_platform/spi_stateless_expressor",
            "PortSpecs" : null,
            "Cmd" : [
               "/sbin/my_init"
            ],
            "NetworkDisabled" : false,
            "AttachStdout" : false,
            "Memory" : 0,
            "Hostname" : "6c20c40aa42c",
            "WorkingDir" : "",
            "Tty" : false,
            "OnBuild" : null,
            "ExposedPorts" : {
               "8080/tcp" : {}
            },
            "AttachStdin" : false,
            "User" : "",
            "OpenStdin" : false,
            "Entrypoint" : [
               "/bin/sh",
               "-c",
               "/run.sh"
            ]
         },
         "Args" : [
            "-c",
            "/run.sh",
            "/sbin/my_init"
         ],
         "ID" : "6c20c40aa42c4066b34f8ea3449c16c988ab0bf4c5e1fc44b23797bacf2d10d8",
         "VolumesRW" : {},
         "HostsPath" : "/var/lib/docker/containers/6c20c40aa42c4066b34f8ea3449c16c988ab0bf4c5e1fc44b23797bacf2d10d8/hosts",
         "NetworkSettings" : {
            "Bridge" : "docker0",
            "PortMapping" : null,
            "Gateway" : "172.17.42.1",
            "IPAddress" : "172.17.0.7",
            "IPPrefixLen" : 16,
            "Ports" : {
               "8080/tcp" : null
            }
         },
         "HostConfig" : {
            "ContainerIDFile" : "",
            "LxcConf" : null,
            "Links" : null,
            "Binds" : null,
            "PortBindings" : null,
            "PublishAllPorts" : false,
            "Privileged" : false
         }
      },
      "Created" : 1402849927,
      "links" : [
         {
            "rel" : "self",
            "href" : "http://172.17.0.2:8080/container/6c20c40aa42c4066b34f8ea3449c16c988ab0bf4c5e1fc44b23797bacf2d10d8"
         },
         {
            "rel" : "stdout",
            "href" : "http://172.17.0.2:8080/container/6c20c40aa42c4066b34f8ea3449c16c988ab0bf4c5e1fc44b23797bacf2d10d8/stdout"
         },
         {
            "href" : "http://172.17.0.2:8080/container/6c20c40aa42c4066b34f8ea3449c16c988ab0bf4c5e1fc44b23797bacf2d10d8/stderr",
            "rel" : "stderr"
         }
      ],
      "id" : "6c20c40aa42c4066b34f8ea3449c16c988ab0bf4c5e1fc44b23797bacf2d10d8",
      "Ports" : [
         {
            "PublicPort" : 8080,
            "Type" : "tcp"
         }
      ],
      "Command" : "/bin/sh -c /run.sh /sbin/my_init",
      "provides" : [
         {
            "port" : "8080",
            "name" : "sp-stateless-expressor"
         }
      ],
      "Names" : [
         "/sp-stateless_expressor"
      ],
      "Id" : "6c20c40aa42c4066b34f8ea3449c16c988ab0bf4c5e1fc44b23797bacf2d10d8",
      "Status" : "Up 9 minutes",
      "Image" : "sp_platform/spi_stateless_expressor:latest"
   },
   {
      "Command" : "/bin/sh -c /run.sh /bin/sh -c #(nop) ADD file:279e501225bebbb7a9861670b669f83f4fcc4f1d4982edfc396e658c6364eaa4 in /",
      "provides" : [
         {
            "port" : "8080",
            "name" : "sp-cell-expressor"
         }
      ],
      "Names" : [
         "/sp-cell_expressor"
      ],
      "Id" : "5621913364ebf23617cac0f9133800ede63d54f5243d38d2f7acf8fd5aa046a5",
      "Status" : "Up 9 minutes",
      "Image" : "sp_platform/spi_cell_expressor:latest",
      "inspection" : {
         "Volumes" : {},
         "ExecDriver" : "native-0.1",
         "State" : {
            "FinishedAt" : "0001-01-01T00:00:00Z",
            "Ghost" : false,
            "ExitCode" : 0,
            "Pid" : 50201,
            "Running" : true,
            "StartedAt" : "2014-06-15T16:32:03.724050793Z"
         },
         "Created" : "2014-06-15T16:32:03.65885953Z",
         "Name" : "/sp-cell_expressor",
         "Path" : "/bin/sh",
         "Driver" : "aufs",
         "HostnamePath" : "/var/lib/docker/containers/5621913364ebf23617cac0f9133800ede63d54f5243d38d2f7acf8fd5aa046a5/hostname",
         "Image" : "6ec699bf4626e15947bcccbed28309a6bbdec5afbe862a454ff06050c81d8c1d",
         "ResolvConfPath" : "/var/lib/docker/containers/5621913364ebf23617cac0f9133800ede63d54f5243d38d2f7acf8fd5aa046a5/resolv.conf",
         "Config" : {
            "AttachStdin" : false,
            "ExposedPorts" : {
               "8080/tcp" : {}
            },
            "OnBuild" : null,
            "Entrypoint" : [
               "/bin/sh",
               "-c",
               "/run.sh"
            ],
            "OpenStdin" : false,
            "User" : "",
            "Memory" : 0,
            "Cmd" : [
               "/bin/sh",
               "-c",
               "#(nop) ADD file:279e501225bebbb7a9861670b669f83f4fcc4f1d4982edfc396e658c6364eaa4 in /"
            ],
            "NetworkDisabled" : false,
            "AttachStdout" : false,
            "Tty" : false,
            "WorkingDir" : "",
            "Hostname" : "5621913364eb",
            "Dns" : null,
            "StdinOnce" : false,
            "Env" : [
               "sp-control-plane_PORT=8080",
               "sp-control-plane_HOST=172.17.0.2",
               "sp_proxy_PORT=8888",
               "sp_proxy_HOST=172.17.0.8",
               "sp_proxy_URL=172.17.0.8:8888",
               "HOME=/root",
               "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
               "PROVIDES=sp-cell-expressor:8080"
            ],
            "MemorySwap" : 0,
            "PortSpecs" : null,
            "Image" : "sp_platform/spi_cell_expressor",
            "Volumes" : null,
            "AttachStderr" : false,
            "Domainname" : "",
            "CpuShares" : 0,
            "VolumesFrom" : ""
         },
         "Args" : [
            "-c",
            "/run.sh",
            "/bin/sh",
            "-c",
            "#(nop) ADD file:279e501225bebbb7a9861670b669f83f4fcc4f1d4982edfc396e658c6364eaa4 in /"
         ],
         "ID" : "5621913364ebf23617cac0f9133800ede63d54f5243d38d2f7acf8fd5aa046a5",
         "NetworkSettings" : {
            "IPAddress" : "172.17.0.6",
            "Ports" : {
               "8080/tcp" : null
            },
            "IPPrefixLen" : 16,
            "Bridge" : "docker0",
            "PortMapping" : null,
            "Gateway" : "172.17.42.1"
         },
         "HostConfig" : {
            "ContainerIDFile" : "",
            "LxcConf" : null,
            "Binds" : null,
            "Links" : null,
            "Privileged" : false,
            "PortBindings" : null,
            "PublishAllPorts" : false
         },
         "HostsPath" : "/var/lib/docker/containers/5621913364ebf23617cac0f9133800ede63d54f5243d38d2f7acf8fd5aa046a5/hosts",
         "VolumesRW" : {}
      },
      "Created" : 1402849923,
      "links" : [
         {
            "href" : "http://172.17.0.2:8080/container/5621913364ebf23617cac0f9133800ede63d54f5243d38d2f7acf8fd5aa046a5",
            "rel" : "self"
         },
         {
            "href" : "http://172.17.0.2:8080/container/5621913364ebf23617cac0f9133800ede63d54f5243d38d2f7acf8fd5aa046a5/stdout",
            "rel" : "stdout"
         },
         {
            "href" : "http://172.17.0.2:8080/container/5621913364ebf23617cac0f9133800ede63d54f5243d38d2f7acf8fd5aa046a5/stderr",
            "rel" : "stderr"
         }
      ],
      "id" : "5621913364ebf23617cac0f9133800ede63d54f5243d38d2f7acf8fd5aa046a5",
      "Ports" : [
         {
            "Type" : "tcp",
            "PublicPort" : 8080
         }
      ]
   },
   {
      "Ports" : [
         {
            "Type" : "tcp",
            "PublicPort" : 8888
         }
      ],
      "id" : "45e32f7518cff84cd269e3b056aec3ef1cc9b28a7be9889e98fc94b78ccf2d87",
      "Created" : 1402849918,
      "inspection" : {
         "NetworkSettings" : {
            "Bridge" : "docker0",
            "Gateway" : "172.17.42.1",
            "PortMapping" : null,
            "IPAddress" : "172.17.0.5",
            "IPPrefixLen" : 16,
            "Ports" : {
               "8888/tcp" : null
            }
         },
         "HostConfig" : {
            "PortBindings" : null,
            "PublishAllPorts" : false,
            "Privileged" : false,
            "ContainerIDFile" : "",
            "LxcConf" : null,
            "Links" : null,
            "Binds" : null
         },
         "HostsPath" : "/var/lib/docker/containers/45e32f7518cff84cd269e3b056aec3ef1cc9b28a7be9889e98fc94b78ccf2d87/hosts",
         "VolumesRW" : {},
         "Args" : [
            "-c",
            "/spaas/nodejs/bin/node app.js"
         ],
         "ID" : "45e32f7518cff84cd269e3b056aec3ef1cc9b28a7be9889e98fc94b78ccf2d87",
         "Config" : {
            "Entrypoint" : [
               "/bin/sh",
               "-c",
               "/spaas/nodejs/bin/node app.js"
            ],
            "OpenStdin" : false,
            "User" : "",
            "AttachStdin" : false,
            "ExposedPorts" : {
               "8888/tcp" : {}
            },
            "OnBuild" : null,
            "Tty" : false,
            "WorkingDir" : "/proxy",
            "Hostname" : "45e32f7518cf",
            "Memory" : 0,
            "AttachStdout" : false,
            "NetworkDisabled" : false,
            "Cmd" : null,
            "PortSpecs" : null,
            "Image" : "sp_platform/spi_gns",
            "Dns" : null,
            "StdinOnce" : false,
            "Env" : [
               "sp-control-plane_PORT=8080",
               "sp-control-plane_HOST=172.17.0.2",
               "sp_proxy_PORT=8888",
               "sp_proxy_HOST=172.17.0.8",
               "sp_proxy_URL=172.17.0.8:8888",
               "HOME=/",
               "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "MemorySwap" : 0,
            "Domainname" : "",
            "VolumesFrom" : "",
            "CpuShares" : 0,
            "Volumes" : null,
            "AttachStderr" : false
         },
         "Image" : "754d5263546ff93304a70a48e9c8e8648f6d32323254a683ed486ef28908d337",
         "ResolvConfPath" : "/var/lib/docker/containers/45e32f7518cff84cd269e3b056aec3ef1cc9b28a7be9889e98fc94b78ccf2d87/resolv.conf",
         "Driver" : "aufs",
         "HostnamePath" : "/var/lib/docker/containers/45e32f7518cff84cd269e3b056aec3ef1cc9b28a7be9889e98fc94b78ccf2d87/hostname",
         "Path" : "/bin/sh",
         "Volumes" : {},
         "ExecDriver" : "native-0.1",
         "State" : {
            "FinishedAt" : "0001-01-01T00:00:00Z",
            "ExitCode" : 0,
            "Ghost" : false,
            "Pid" : 50036,
            "StartedAt" : "2014-06-15T16:31:58.316791523Z",
            "Running" : true
         },
         "Created" : "2014-06-15T16:31:58.277279028Z",
         "Name" : "/sp-gns"
      },
      "links" : [
         {
            "rel" : "self",
            "href" : "http://172.17.0.2:8080/container/45e32f7518cff84cd269e3b056aec3ef1cc9b28a7be9889e98fc94b78ccf2d87"
         },
         {
            "rel" : "stdout",
            "href" : "http://172.17.0.2:8080/container/45e32f7518cff84cd269e3b056aec3ef1cc9b28a7be9889e98fc94b78ccf2d87/stdout"
         },
         {
            "href" : "http://172.17.0.2:8080/container/45e32f7518cff84cd269e3b056aec3ef1cc9b28a7be9889e98fc94b78ccf2d87/stderr",
            "rel" : "stderr"
         }
      ],
      "Image" : "sp_platform/spi_gns:latest",
      "Status" : "Up 9 minutes",
      "provides" : [],
      "Names" : [
         "/sp-gns"
      ],
      "Id" : "45e32f7518cff84cd269e3b056aec3ef1cc9b28a7be9889e98fc94b78ccf2d87",
      "Command" : "/bin/sh -c /spaas/nodejs/bin/node app.js"
   },
   {
      "Status" : "Up 9 minutes",
      "Image" : "sp_platform/spi_nucleus:latest",
      "Command" : "/bin/sh -c /bin/sh /spaas/project/run.sh",
      "Id" : "a94ba20f94a2783a7304935c324f4fa9a29a5fa73d7f8c3b7b1d29a6eb8da119",
      "Names" : [
         "/sp-nucleus"
      ],
      "provides" : [
         {
            "name" : "sp-gene-store",
            "port" : "8080"
         }
      ],
      "Ports" : [
         {
            "PublicPort" : 8080,
            "Type" : "tcp"
         }
      ],
      "links" : [
         {
            "href" : "http://172.17.0.2:8080/container/a94ba20f94a2783a7304935c324f4fa9a29a5fa73d7f8c3b7b1d29a6eb8da119",
            "rel" : "self"
         },
         {
            "href" : "http://172.17.0.2:8080/container/a94ba20f94a2783a7304935c324f4fa9a29a5fa73d7f8c3b7b1d29a6eb8da119/stdout",
            "rel" : "stdout"
         },
         {
            "href" : "http://172.17.0.2:8080/container/a94ba20f94a2783a7304935c324f4fa9a29a5fa73d7f8c3b7b1d29a6eb8da119/stderr",
            "rel" : "stderr"
         }
      ],
      "inspection" : {
         "Path" : "/bin/sh",
         "State" : {
            "Pid" : 49863,
            "Running" : true,
            "StartedAt" : "2014-06-15T16:31:54.511187942Z",
            "FinishedAt" : "0001-01-01T00:00:00Z",
            "ExitCode" : 0,
            "Ghost" : false
         },
         "Created" : "2014-06-15T16:31:54.458638647Z",
         "Name" : "/sp-nucleus",
         "Volumes" : {},
         "ExecDriver" : "native-0.1",
         "Image" : "d7027454d595ecb3b5dfe81e74d185aebfe8adbd40bbf050103f0cb09a165c7c",
         "ResolvConfPath" : "/var/lib/docker/containers/a94ba20f94a2783a7304935c324f4fa9a29a5fa73d7f8c3b7b1d29a6eb8da119/resolv.conf",
         "HostnamePath" : "/var/lib/docker/containers/a94ba20f94a2783a7304935c324f4fa9a29a5fa73d7f8c3b7b1d29a6eb8da119/hostname",
         "Driver" : "aufs",
         "Args" : [
            "-c",
            "/bin/sh /spaas/project/run.sh"
         ],
         "ID" : "a94ba20f94a2783a7304935c324f4fa9a29a5fa73d7f8c3b7b1d29a6eb8da119",
         "Config" : {
            "NetworkDisabled" : false,
            "Cmd" : null,
            "AttachStdout" : false,
            "Memory" : 0,
            "Hostname" : "a94ba20f94a2",
            "Tty" : false,
            "WorkingDir" : "/spaas/project",
            "OnBuild" : null,
            "ExposedPorts" : {
               "8080/tcp" : {}
            },
            "AttachStdin" : false,
            "User" : "",
            "OpenStdin" : false,
            "Entrypoint" : [
               "/bin/sh",
               "-c",
               "/bin/sh /spaas/project/run.sh"
            ],
            "AttachStderr" : false,
            "Volumes" : null,
            "VolumesFrom" : "",
            "CpuShares" : 0,
            "Domainname" : "",
            "MemorySwap" : 0,
            "Env" : [
               "sp-control-plane_PORT=8080",
               "sp-control-plane_HOST=172.17.0.2",
               "sp_proxy_PORT=8888",
               "sp_proxy_HOST=172.17.0.8",
               "sp_proxy_URL=172.17.0.8:8888",
               "HOME=/",
               "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
               "PROVIDES=sp-gene-store:8080"
            ],
            "StdinOnce" : false,
            "Dns" : null,
            "Image" : "sp_platform/spi_nucleus",
            "PortSpecs" : null
         },
         "HostsPath" : "/var/lib/docker/containers/a94ba20f94a2783a7304935c324f4fa9a29a5fa73d7f8c3b7b1d29a6eb8da119/hosts",
         "VolumesRW" : {},
         "NetworkSettings" : {
            "Ports" : {
               "8080/tcp" : null
            },
            "IPPrefixLen" : 16,
            "IPAddress" : "172.17.0.4",
            "PortMapping" : null,
            "Gateway" : "172.17.42.1",
            "Bridge" : "docker0"
         },
         "HostConfig" : {
            "ContainerIDFile" : "",
            "LxcConf" : null,
            "Links" : null,
            "Binds" : null,
            "PortBindings" : null,
            "PublishAllPorts" : false,
            "Privileged" : false
         }
      },
      "Created" : 1402849914,
      "id" : "a94ba20f94a2783a7304935c324f4fa9a29a5fa73d7f8c3b7b1d29a6eb8da119"
   },
   {
      "Ports" : [
         {
            "PrivatePort" : 8888,
            "IP" : "0.0.0.0",
            "Type" : "tcp",
            "PublicPort" : 8888
         }
      ],
      "inspection" : {
         "ID" : "96cea4875f9c8b0e9406f6fa9e8d7ff2778736386465b81fbeaeaab40cf2c53f",
         "Args" : [
            "-c",
            "/spaas/nodejs/bin/node app.js"
         ],
         "Config" : {
            "Memory" : 0,
            "NetworkDisabled" : false,
            "Cmd" : null,
            "AttachStdout" : false,
            "Hostname" : "96cea4875f9c",
            "WorkingDir" : "/proxy",
            "Tty" : false,
            "AttachStdin" : false,
            "OnBuild" : null,
            "ExposedPorts" : {
               "8888/tcp" : {}
            },
            "OpenStdin" : false,
            "Entrypoint" : [
               "/bin/sh",
               "-c",
               "/spaas/nodejs/bin/node app.js"
            ],
            "User" : "",
            "AttachStderr" : false,
            "Volumes" : null,
            "Domainname" : "",
            "VolumesFrom" : "",
            "CpuShares" : 0,
            "StdinOnce" : false,
            "Dns" : null,
            "MemorySwap" : 0,
            "Env" : [
               "sp-control-plane_PORT=8080",
               "sp-control-plane_HOST=172.17.0.2",
               "sp_proxy_PORT=8888",
               "sp_proxy_HOST=172.17.0.8",
               "sp_proxy_URL=172.17.0.8:8888",
               "HOME=/",
               "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
               "SP_REGISTRY_HOST=172.17.0.6"
            ],
            "PortSpecs" : null,
            "Image" : "sp_platform/spi_sp_proxy"
         },
         "HostConfig" : {
            "LxcConf" : null,
            "Binds" : null,
            "Links" : null,
            "ContainerIDFile" : "",
            "Privileged" : false,
            "PublishAllPorts" : false,
            "PortBindings" : {
               "8888/tcp" : [
                  {
                     "HostPort" : "8888",
                     "HostIp" : "0.0.0.0"
                  }
               ]
            }
         },
         "NetworkSettings" : {
            "Bridge" : "docker0",
            "Gateway" : "172.17.42.1",
            "PortMapping" : null,
            "IPAddress" : "172.17.0.3",
            "Ports" : {
               "8888/tcp" : [
                  {
                     "HostIp" : "0.0.0.0",
                     "HostPort" : "8888"
                  }
               ]
            },
            "IPPrefixLen" : 16
         },
         "VolumesRW" : {},
         "HostsPath" : "/var/lib/docker/containers/96cea4875f9c8b0e9406f6fa9e8d7ff2778736386465b81fbeaeaab40cf2c53f/hosts",
         "Path" : "/bin/sh",
         "ExecDriver" : "native-0.1",
         "Volumes" : {},
         "Name" : "/sp-sp_proxy",
         "State" : {
            "Ghost" : false,
            "ExitCode" : 0,
            "FinishedAt" : "0001-01-01T00:00:00Z",
            "Pid" : 49715,
            "Running" : true,
            "StartedAt" : "2014-06-15T16:31:51.580366988Z"
         },
         "Created" : "2014-06-15T16:31:51.530172406Z",
         "ResolvConfPath" : "/var/lib/docker/containers/96cea4875f9c8b0e9406f6fa9e8d7ff2778736386465b81fbeaeaab40cf2c53f/resolv.conf",
         "Image" : "7b1b28f6258965cf9f2d8353297a2e0e470528f97e7df75586fc2191b9c7c617",
         "Driver" : "aufs",
         "HostnamePath" : "/var/lib/docker/containers/96cea4875f9c8b0e9406f6fa9e8d7ff2778736386465b81fbeaeaab40cf2c53f/hostname"
      },
      "Created" : 1402849911,
      "links" : [
         {
            "href" : "http://172.17.0.2:8080/container/96cea4875f9c8b0e9406f6fa9e8d7ff2778736386465b81fbeaeaab40cf2c53f",
            "rel" : "self"
         },
         {
            "rel" : "stdout",
            "href" : "http://172.17.0.2:8080/container/96cea4875f9c8b0e9406f6fa9e8d7ff2778736386465b81fbeaeaab40cf2c53f/stdout"
         },
         {
            "rel" : "stderr",
            "href" : "http://172.17.0.2:8080/container/96cea4875f9c8b0e9406f6fa9e8d7ff2778736386465b81fbeaeaab40cf2c53f/stderr"
         }
      ],
      "id" : "96cea4875f9c8b0e9406f6fa9e8d7ff2778736386465b81fbeaeaab40cf2c53f",
      "Status" : "Up 9 minutes",
      "Image" : "sp_platform/spi_sp_proxy:latest",
      "Command" : "/bin/sh -c /spaas/nodejs/bin/node app.js",
      "provides" : [],
      "Names" : [
         "/sp-sp_proxy"
      ],
      "Id" : "96cea4875f9c8b0e9406f6fa9e8d7ff2778736386465b81fbeaeaab40cf2c53f"
   },
   {
      "Image" : "sp_platform/spi_control_plane:latest",
      "Status" : "Up 9 minutes",
      "provides" : [
         {
            "name" : "sp-control-plane",
            "port" : "8080"
         }
      ],
      "Names" : [
         "/sp-control_plane"
      ],
      "Id" : "c4efa54ffe138db198620c5eca74216e8dca56911b6bd5a392b43df26aad9677",
      "Command" : "/bin/sh -c /run.sh /bin/sh -c #(nop) ADD file:ceff35705da8996dd2fbf40b23ab049c01cfd1fcfee5b0c266876ab8a4e1b0d2 in /",
      "Ports" : [
         {
            "PublicPort" : 8080,
            "Type" : "tcp"
         }
      ],
      "id" : "c4efa54ffe138db198620c5eca74216e8dca56911b6bd5a392b43df26aad9677",
      "inspection" : {
         "Args" : [
            "-c",
            "/run.sh",
            "/bin/sh",
            "-c",
            "#(nop) ADD file:ceff35705da8996dd2fbf40b23ab049c01cfd1fcfee5b0c266876ab8a4e1b0d2 in /"
         ],
         "ID" : "c4efa54ffe138db198620c5eca74216e8dca56911b6bd5a392b43df26aad9677",
         "Config" : {
            "Hostname" : "c4efa54ffe13",
            "Tty" : false,
            "WorkingDir" : "",
            "Memory" : 0,
            "Cmd" : [
               "/bin/sh",
               "-c",
               "#(nop) ADD file:ceff35705da8996dd2fbf40b23ab049c01cfd1fcfee5b0c266876ab8a4e1b0d2 in /"
            ],
            "NetworkDisabled" : false,
            "AttachStdout" : false,
            "OpenStdin" : false,
            "Entrypoint" : [
               "/bin/sh",
               "-c",
               "/run.sh"
            ],
            "User" : "",
            "AttachStdin" : false,
            "OnBuild" : null,
            "ExposedPorts" : {
               "8080/tcp" : {}
            },
            "Domainname" : "",
            "VolumesFrom" : "",
            "CpuShares" : 0,
            "Volumes" : null,
            "AttachStderr" : false,
            "PortSpecs" : null,
            "Image" : "sp_platform/spi_control_plane",
            "Dns" : null,
            "StdinOnce" : false,
            "MemorySwap" : 0,
            "Env" : [
               "HOME=/root",
               "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
               "PROVIDES=sp-control-plane:8080"
            ]
         },
         "NetworkSettings" : {
            "Ports" : {
               "8080/tcp" : null
            },
            "IPPrefixLen" : 16,
            "IPAddress" : "172.17.0.2",
            "Gateway" : "172.17.42.1",
            "PortMapping" : null,
            "Bridge" : "docker0"
         },
         "HostConfig" : {
            "Privileged" : false,
            "PublishAllPorts" : false,
            "PortBindings" : {
               "8080/tcp" : null
            },
            "Links" : null,
            "LxcConf" : [],
            "Binds" : null,
            "ContainerIDFile" : ""
         },
         "VolumesRW" : {},
         "HostsPath" : "/var/lib/docker/containers/c4efa54ffe138db198620c5eca74216e8dca56911b6bd5a392b43df26aad9677/hosts",
         "Path" : "/bin/sh",
         "ExecDriver" : "native-0.1",
         "Volumes" : {},
         "State" : {
            "StartedAt" : "2014-06-15T16:31:43.451828392Z",
            "Running" : true,
            "Pid" : 49476,
            "ExitCode" : 0,
            "Ghost" : false,
            "FinishedAt" : "0001-01-01T00:00:00Z"
         },
         "Created" : "2014-06-15T16:31:43.415753092Z",
         "Name" : "/sp-control_plane",
         "Image" : "0ecbdc59afe170e04a9f3e196bf5dc71b2aec218af6a8dba7bfc143fbc0c0414",
         "ResolvConfPath" : "/var/lib/docker/containers/c4efa54ffe138db198620c5eca74216e8dca56911b6bd5a392b43df26aad9677/resolv.conf",
         "Driver" : "aufs",
         "HostnamePath" : "/var/lib/docker/containers/c4efa54ffe138db198620c5eca74216e8dca56911b6bd5a392b43df26aad9677/hostname"
      },
      "Created" : 1402849903,
      "links" : [
         {
            "rel" : "self",
            "href" : "http://172.17.0.2:8080/container/c4efa54ffe138db198620c5eca74216e8dca56911b6bd5a392b43df26aad9677"
         },
         {
            "rel" : "stdout",
            "href" : "http://172.17.0.2:8080/container/c4efa54ffe138db198620c5eca74216e8dca56911b6bd5a392b43df26aad9677/stdout"
         },
         {
            "rel" : "stderr",
            "href" : "http://172.17.0.2:8080/container/c4efa54ffe138db198620c5eca74216e8dca56911b6bd5a392b43df26aad9677/stderr"
         }
      ]
   },
   {
      "Image" : "sp_platform/uber-any:latest",
      "Status" : "Up 7 minutes",
      "Id" : "cc881d67bf8cd62d454553bd1154518954c17c4093fba2ea56b2ff1d4cddd8b5",
      "provides" : [],
      "Names" : [
         "/cell-simplenode"
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
         "Name" : "/cell-simplenode",
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
            "IPAddress" : "172.17.0.10"
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
]

*/















