var http = require('http');
 url  = require('url');

function apiHandler(req, res) { 
   var url_parts = url.parse(req.url);
   //console.log('url path: ' + url_parts.path);    
   if (url_parts.path == '/containers/json') {
      console.log('mockDockerApi, writing containersJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(containersJson()) );
      res.end(); 
   } else if (url_parts.path == '/containers/sp-phenotype-monitor/json') {
      console.log('mockDockerApi, writing phenotypeJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(phenotypeJson()) );
      res.end();        
       
   } else if (url_parts.path == '/containers/sp-control-plane/json') {
      console.log('mockDockerApi, writing controlPlaneJson()');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(controlPlaneJson()) );
      res.end();        
       
   } else {
      console.log('mockDockerApi, no match for ' + url_parts.path);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({error: "no record found matching " + url_parts.path}) );      
      res.end();  
       
   }
   
}

function httpStartupComplete(port) {
    console.log("starting http server on port " + port);
}



//create mock remote docker API  
http.createServer(apiHandler).listen(4321, httpStartupComplete(4321));


function containersJson() {
    
    
 return [
   {
      "Command":"/bin/sh -c /run.sh /bin/sh -c #(nop) ADD file:4b0665f1d9af8b0049e556f922fc1b2b22d9d321c0d910c7ce9894f6290b26db in /",
      "Created":1397105656,
      "Id":"2aa1fd69ce9ce66590ba7fe6e73ae43881c965675b71e1d7332d5e125f1e87cb",
      "Image":"861464fb014f",
      "Names":[
         "/sp-gene-expressor"
      ],
      "Ports":[
         {
            "PublicPort":8080,
            "Type":"tcp"
         }
      ],
      "Status":"Up 5 hours"
   },
   {
      "Command":"/bin/sh -c /run.sh /bin/sh -c #(nop) ADD file:08524b1418681c45c9267bc2b48c30047cda5fdf11faee7a15db9cf5e31bdd51 in /",
      "Created":1397105656,
      "Id":"9a959bc885203e5f20c654d60695cb02f1b546e665186ee60b022764adc65677",
      "Image":"778d358826fb",
      "Names":[
         "/sp-phenotype-monitor"
      ],
      "Ports":[
         {
            "PublicPort":8080,
            "Type":"tcp"
         }
      ],
      "Status":"Up 5 hours"
   },
   {
      "Command":"/bin/sh -c /run.sh /bin/sh -c #(nop) ADD file:5bc6222b683004a08cf14369e96b493beb100f1da0da2b51f8378a76e68dee32 in /",
      "Created":1397105655,
      "Id":"6535400f4056b7a1cc6d00690f19dfdb13412283ceb94f379a294e3030e33585",
      "Image":"54c073853571",
      "Names":[
         "/sp-gene-store"
      ],
      "Ports":[
         {
            "PublicPort":8080,
            "Type":"tcp"
         }
      ],
      "Status":"Up 5 hours"
   },
   {
      "Command":"/bin/sh -c /run.sh",
      "Created":1397104571,
      "Id":"5ca74d1b35544d2af6aea081c5e409dd8e8b06f1edec4d17da735f5ccb436108",
      "Image":"3c28431f91f5",
      "Names":[
         "/sp-control-plane"
      ],
      "Ports":[
         {
            "PublicPort":8080,
            "Type":"tcp"
         }
      ],
      "Status":"Up 5 hours"
   },
 
  
];   
    
}
     
 function controlPlaneJson() {
     
    //console.log('mockDockerApi, controlPlaneJson()');
   return {
   "ID":"9a959bc885203e5f20c654d60695cb02f1b546e665186ee60b022764adc65677",
   "Created":"2014-04-10T04:54:16.437697468Z",
   "Path":"/bin/sh",
   "Args":[
      "-c",
      "/run.sh",
      "/bin/sh",
      "-c",
      "#(nop) ADD file:08524b1418681c45c9267bc2b48c30047cda5fdf11faee7a15db9cf5e31bdd51 in /"
   ],
   "Config":{
      "Hostname":"9a959bc88520",
      "Domainname":"",
      "User":"",
      "Memory":0,
      "MemorySwap":0,
      "CpuShares":0,
      "AttachStdin":false,
      "AttachStdout":false,
      "AttachStderr":false,
      "PortSpecs":null,
      "ExposedPorts":{
         "8080/tcp":{

         }
      },
      "Tty":false,
      "OpenStdin":false,
      "StdinOnce":false,
      "Env":[
         "sp-control-plane_PORT=8080",
         "sp-control-plane_HOST=172.17.0.8",
         "HOME=/",
         "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
         "PROVIDES=sp-phenotype-monitor:8080"
      ],
      "Cmd":[
         "/bin/sh",
         "-c",
         "#(nop) ADD file:08524b1418681c45c9267bc2b48c30047cda5fdf11faee7a15db9cf5e31bdd51 in /"
      ],
      "Dns":null,
      "Image":"sp-platform/spi-control-plane",
      "Volumes":null,
      "VolumesFrom":"",
      "WorkingDir":"",
      "Entrypoint":[
         "/bin/sh",
         "-c",
         "/run.sh"
      ],
      "NetworkDisabled":false,
      "OnBuild":null
   },
   "State":{
      "Running":true,
      "Pid":13056,
      "ExitCode":0,
      "StartedAt":"2014-04-10T04:54:16.472916822Z",
      "FinishedAt":"0001-01-01T00:00:00Z",
      "Ghost":false
   },
   "Image":"778d358826fb2d5638d1436eb6da76b65916b7139fb9ecab3f468c75ef8aa967",
   "NetworkSettings":{
      "IPAddress":"172.17.0.10",
      "IPPrefixLen":16,
      "Gateway":"172.17.42.1",
      "Bridge":"docker0",
      "PortMapping":null,
      "Ports":{
         "8080/tcp":null
      }
   },
   "ResolvConfPath":"/etc/resolv.conf",
   "HostnamePath":"/var/lib/docker/containers/9a959bc885203e5f20c654d60695cb02f1b546e665186ee60b022764adc65677/hostname",
   "HostsPath":"/var/lib/docker/containers/9a959bc885203e5f20c654d60695cb02f1b546e665186ee60b022764adc65677/hosts",
   "Name":"/sp-phenotype-monitor",
   "Driver":"aufs",
   "ExecDriver":"native-0.1",
   "Volumes":{

   },
   "VolumesRW":{

   },
   "HostConfig":{
      "Binds":null,
      "ContainerIDFile":"",
      "LxcConf":null,
      "Privileged":false,
      "PortBindings":null,
      "Links":null,
      "PublishAllPorts":false
   }
};

}





function phenotypeJson() {
     
    //console.log('mockDockerApi, controlPlaneJson()');
   return {
   "ID":"6b42b2f885203e5f20c654d60695cb02f1b546e665186ee60b022764ada2bc21",
   "Created":"2014-04-10T04:54:16.437697468Z",
   "Path":"/bin/sh",
   "Args":[
      "-c",
      "/run.sh",
      "/bin/sh",
      "-c",
      "#(nop) ADD file:08524b1418681c45c9267bc2b48c30047cda5fdf11faee7a15db9cf5e31bdd51 in /"
   ],
   "Config":{
      "Hostname":"a1459bc88520",
      "Domainname":"",
      "User":"",
      "Memory":0,
      "MemorySwap":0,
      "CpuShares":0,
      "AttachStdin":false,
      "AttachStdout":false,
      "AttachStderr":false,
      "PortSpecs":null,
      "ExposedPorts":{
         "8081/tcp":{

         }
      },
      "Tty":false,
      "OpenStdin":false,
      "StdinOnce":false,
      "Env":[
         "sp-control-plane_PORT=8080",
         "sp-control-plane_HOST=172.17.0.8",
         "HOME=/",
         "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
         "PROVIDES=sp-phenotype-monitor:8080"
      ],
      "Cmd":[
         "/bin/sh",
         "-c",
         "#(nop) ADD file:08524b1418681c45c9267bc2b48c30047cda5fdf11faee7a15db9cf5e31bdd51 in /"
      ],
      "Dns":null,
      "Image":"sp-platform/spi-phenotype-monitor",
      "Volumes":null,
      "VolumesFrom":"",
      "WorkingDir":"",
      "Entrypoint":[
         "/bin/sh",
         "-c",
         "/run.sh"
      ],
      "NetworkDisabled":false,
      "OnBuild":null
   },
   "State":{
      "Running":true,
      "Pid":13056,
      "ExitCode":0,
      "StartedAt":"2014-04-10T04:54:16.472916822Z",
      "FinishedAt":"0001-01-01T00:00:00Z",
      "Ghost":false
   },
   "Image":"778d358826fb2d5638d1436eb6da76b65916b7139fb9ecab3f468c75ef8aa967",
   "NetworkSettings":{
      "IPAddress":"172.17.0.8",
      "IPPrefixLen":16,
      "Gateway":"172.17.42.1",
      "Bridge":"docker0",
      "PortMapping":null,
      "Ports":{
         "8081/tcp":null
      }
   },
   "ResolvConfPath":"/etc/resolv.conf",
   "HostnamePath":"/var/lib/docker/containers/9a959bc885203e5f20c654d60695cb02f1b546e665186ee60b022764adc65677/hostname",
   "HostsPath":"/var/lib/docker/containers/9a959bc885203e5f20c654d60695cb02f1b546e665186ee60b022764adc65677/hosts",
   "Name":"/sp-phenotype-monitor",
   "Driver":"aufs",
   "ExecDriver":"native-0.1",
   "Volumes":{

   },
   "VolumesRW":{

   },
   "HostConfig":{
      "Binds":null,
      "ContainerIDFile":"",
      "LxcConf":null,
      "Privileged":false,
      "PortBindings":null,
      "Links":null,
      "PublishAllPorts":false
   }
  };
}
