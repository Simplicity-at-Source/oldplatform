var _ = require('underscore');



exports.muonToDocker = muonToDocker;
exports.getEnvironmentVariables = getEnvironmentVariables;

function muonToDocker(payload) {
      var dockerPayload =  {
            'Name': payload.name,
            'Image': payload.imageId
      };  
    dockerPayload["Env"] = getEnvironmentVariables(payload);
    return dockerPayload;
}

function getEnvironmentVariables(dockerPayload) {
    
    /*
    var env = json?.dependencies?.collect {
      ["${it.dependency}_PORT=${it.port}", "${it.dependency}_HOST=${it.host}"]
    }?.flatten()

    if (!env) {
      env = []
    }
    */
    var env = [];
   
     for (var key in dockerPayload.env) {
         var value = dockerPayload.env[key];
         var str = key + '=' + value;
         env.push(str);
     }
    return env

}