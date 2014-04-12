package simplepaas.controlplane.commands

import groovy.json.JsonBuilder
import org.springframework.beans.factory.annotation.Autowired
import simplepaas.controlplane.JSONApi

/**
 * Created by david on 12/04/14.
 */
class CreateContainer {
  @Autowired
  JSONApi dockerApi

  def call(json) {

    def dockerRet = dockerApi.post("/containers/create?name=${json.name}", new JsonBuilder([
        "Image": json.imageId,
        "Env": getEnvironmentVariables(json)
    ]).toString())

    //TODO, start the container!
    dockerApi.post("/containers/${dockerRet.Id}/start", new JsonBuilder([:]).toString())

    [message: "Container created",
        id: dockerRet.Id
    ]
  }

  List getEnvironmentVariables(json) {
    json?.dependencies?.collect {
      ["${it.dependency}_PORT=${it.port}", "${it.dependency}_HOST=${it.host}"]
    }?.flatten()
  }
}
