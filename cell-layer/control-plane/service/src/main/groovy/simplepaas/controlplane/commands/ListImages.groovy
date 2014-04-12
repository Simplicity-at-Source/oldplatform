package simplepaas.controlplane.commands

import org.springframework.beans.factory.annotation.Autowired
import simplepaas.controlplane.JSONApi

/**
 * Created by david on 12/04/14.
 */
class ListImages {
  @Autowired
  JSONApi dockerApi

  def call() {

    def dockerRet = dockerApi.get("/containers/json")

    dockerRet
  }
}
