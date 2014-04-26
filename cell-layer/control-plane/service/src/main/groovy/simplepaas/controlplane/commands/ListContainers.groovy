package simplepaas.controlplane.commands

import org.springframework.beans.factory.annotation.Autowired
import simplepaas.controlplane.JSONApi

/**
 * Created by david on 12/04/14.
 */
class ListContainers {
  @Autowired
  JSONApi dockerApi

  def call() {

    def dockerRet = dockerApi.get("/containers/json")

    return dockerRet.collect {
      it.id = it.Id
      it.inspection = dockerApi.get("/containers/${it.Id}/json")
      it.provides = generateProvides(it.inspection)
      it.processes = dockerApi.get("/containers/${it.Id}/top")
      //it.files = dockerApi.get("/containers/${it.Id}/changes")
      it.links = [
          [rel:"self", href:"http://172.17.0.2:8080/container/${it.Id}".toString()],
          [rel:"stdout", href:"http://172.17.0.2:8080/container/${it.Id}/stdout".toString()],
          [rel:"stderr", href:"http://172.17.0.2:8080/container/${it.Id}/stderr".toString()]
      ]
      it
    }
  }

  def generateProvides(containerInspection) {
    def provides = containerInspection.Config?.Env?.find {
      it.startsWith("PROVIDES")
    }

    if (!provides) {
      return []
    }

    def provisions = provides.substring(9)?.split(",")

    return provisions.collect {
      def (name, port) = it.split(":")
      [name: name, port: port]
    }
  }
}
