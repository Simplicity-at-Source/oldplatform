package simplepaas.controlplane.commands

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import org.springframework.beans.factory.annotation.Autowired
import simplepaas.controlplane.JSONApi

/**
 * Created by david on 12/04/14.
 */
class CreateContainer {
  @Autowired
  JSONApi dockerApi
  def proxyHostPort = 8888;

  def call(json) {

        def  dockerRet = dockerApi.post("/containers/create?name=${json.name}", new JsonBuilder([
                  "Image": json.imageId,
                  "Env": getEnvironmentVariables(json)
          ]).toString())

    // If container is sp_proxy then bind port 8080 to host
    if (json.imageId.contains("sp_proxy") || json.name.contains("sp_proxy") ) {
           def proxyStartJson = """
            {
                "PortBindings": { "8888/tcp": [{ "HostPort": "8888" }] },
                "Privileged": false,
                "PublishAllPorts": false
           }
            """
        dockerApi.post("/containers/${dockerRet.Id}/start", proxyStartJson)
    } else {
        dockerApi.post("/containers/${dockerRet.Id}/start", new JsonBuilder([:]).toString())
    }


    [message: "Container created",
        id: dockerRet.Id
    ]
  }

  List getEnvironmentVariables(json) {
    def env = json?.dependencies?.collect {
      ["${it.dependency}_PORT=${it.port}", "${it.dependency}_HOST=${it.host}"]
    }?.flatten()

    if (!env) {
      env = []
    }

    if (json.env) {
      json.env.each { key, value ->
        env << "$key=$value"
      }
    }

    return env
  }
}
