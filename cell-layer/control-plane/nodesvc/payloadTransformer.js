var _ = require('underscore');



exports.muonToDocker = muonToDocker;
exports.getEnvironmentVariables = getEnvironmentVariables;

function muonToDocker(payload) {
      var dockerPayload =  {
            'Image': payload.imageId
      };  
    dockerPayload["Env"] = getEnvironmentVariables(payload);
    return dockerPayload;
}

function getEnvironmentVariables(json) {
    
    /*
    var env = json?.dependencies?.collect {
      ["${it.dependency}_PORT=${it.port}", "${it.dependency}_HOST=${it.host}"]
    }?.flatten()

    if (!env) {
      env = []
    }
    */
    var env = [];
   
     for (var key in json.env) {
         var value = json.env[key];
         var str = key + '=' + value;
         env.push(str);
     }

    
    env.push("sp_proxy_PORT=8888");
    env.push("sp_proxy_HOST=172.17.0.8");
    env.push("sp_proxy_URL=172.17.0.8:8888");
    return env

}