package simplepaas.controlplane.commands

import org.springframework.beans.factory.annotation.Autowired
import simplepaas.controlplane.JSONApi

class ListImages {
  @Autowired
  JSONApi dockerApi

  def call() {

    def dockerRet = dockerApi.get("/images/json")

    dockerRet
  }
}
