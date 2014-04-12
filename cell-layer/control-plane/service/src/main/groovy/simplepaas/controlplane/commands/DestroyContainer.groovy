package simplepaas.controlplane.commands

import org.springframework.beans.factory.annotation.Autowired
import simplepaas.controlplane.JSONApi

/**
 * Created by david on 12/04/14.
 */
class DestroyContainer {
  @Autowired
  JSONApi dockerApi

  def call(id) {

    def dockerRet = dockerApi.post("/containers/${id}/kill")
    dockerRet = dockerApi.delete("/containers/${id}")

    [message: "Container Destroyed"]
  }
}
