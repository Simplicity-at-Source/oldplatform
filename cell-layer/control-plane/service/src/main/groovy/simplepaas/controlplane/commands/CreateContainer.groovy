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

  def call(json) {

    def dockerRet;

      def proxyJson = """{
                 "Image": "$json.imageId",
                 "NetworkSettings": {
                     "Ports": {
                         "$json.port/tcp": [
                                 {
                                     "HostIp": "0.0.0.0",
                                     "HostPort": "$json.port"
                                 }
                         ]
                     }
                 },
                 "HostConfig": {
                     "PortBindings": {
                         "$json.port/tcp": [
                                 {
                                     "HostIp": "0.0.0.0",
                                     "HostPort": "$json.port"
                                 }
                         ]
                     }
                 }
         }"""

      def proxyJson2 = [
                 "Image": "$json.imageId",
                 "NetworkSettings": [
                     "Ports": [
                         "$json.port/tcp": [
                                 [
                                     "HostIp": "0.0.0.0",
                                     "HostPort": "$json.port"
                                 ]
                         ]
                     ]
                 ],
                 "HostConfig": [
                     "PortBindings": [
                         "$json.port/tcp": [
                                 [
                                     "HostIp": "0.0.0.0",
                                     "HostPort": "$json.port"
                                 ]
                         ]
                     ]
                 ]
         ]

      //println("proxyJson: " + proxyJson)
      def result = new JsonSlurper().parseText(proxyJson)

      if (json.port) {
          dockerRet = dockerApi.post("/containers/create?name=${json.name}",  new JsonBuilder(proxyJson2).toString())
      } else {
          dockerRet = dockerApi.post("/containers/create?name=${json.name}", new JsonBuilder([
                  "Image": json.imageId,
                  "Env": getEnvironmentVariables(json)
          ]).toString())
      }
    println("dockerRet=" + dockerRet)
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
