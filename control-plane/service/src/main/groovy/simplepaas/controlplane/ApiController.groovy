package simplepaas.controlplane

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import groovyx.net.http.HTTPBuilder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.ResponseBody

import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*

@Controller
@Configuration
@EnableAutoConfiguration
class ApiController {

  @Autowired CreateContainer createContainerCommand
  @Autowired DestroyContainer destroyContainerCommand
  @Autowired ListContainers listContainersCommand

  @RequestMapping(value="/container", method = RequestMethod.POST)
  @ResponseBody
  def createContainer(@RequestBody String json) {
    try {
      createContainerCommand(fromJson(json))
    } catch (Exception ex) {
      ex.printStackTrace()
      [failure:ex.message]
    }
  }

  @RequestMapping(value="/container", method = RequestMethod.GET)
  @ResponseBody
  def listContainer() {
    try {
      listContainersCommand()
    } catch (Exception ex) {
      ex.printStackTrace()
      [failure:ex.message]
    }
  }

  @RequestMapping(value="/container/{containerId}", method = RequestMethod.DELETE)
  @ResponseBody
  def destroyContainer(@PathVariable(value = "containerId") String containerId) {
    destroyContainerCommand(containerId)
  }

  def fromJson(json) {
    new JsonSlurper().parseText(json)
  }

  @Bean JSONApi api() { new JSONApi() }
  @Bean CreateContainer createContainerBean() { new CreateContainer() }
  @Bean DestroyContainer destroyContainerBean() { new DestroyContainer() }
  @Bean ListContainers listContainersBean() { new ListContainers() }

  static void main(String[] args) throws Exception {
    SpringApplication.run(ApiController, args);
  }
}

class ListContainers {
  @Autowired JSONApi dockerApi

  def call() {

    def dockerRet = dockerApi.get("/containers/json")

    return dockerRet.collect {
      it.inspection = dockerApi.get("/containers/${it.Id}/json")
      it.provides = generateProvides(it.inspection)
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
      [name:name, port:port]
    }
  }
}

class DestroyContainer {
  @Autowired JSONApi dockerApi

  def call(id) {

    def dockerRet = dockerApi.post("/containers/${id}/kill")
    dockerRet = dockerApi.delete("/containers/${id}")

    [message: "Container Destroyed"]
  }
}

class CreateContainer {
  @Autowired JSONApi dockerApi

  def call(json) {

    def dockerRet = dockerApi.post("/containers/create", new JsonBuilder([
            "Image":json.imageId,
            "Env": getEnvironmentVariables(json)
    ]).toString())

    [message: "Container created",
     id:dockerRet.Id
    ]
  }

  List getEnvironmentVariables(json) {
    json?.dependencies?.collect {
      ["${it.dependency}_PORT=${it.port}", "${it.dependency}_HOST=${it.host}"]
    }?.flatten()
  }
}

class JSONApi {

  def post(def url, def data = null) {
    def http = new HTTPBuilder("http://172.17.42.1:4321/${url}")
    def jsonResp
    http.request( POST, JSON ) { req ->
      if (data) {
        body = data
      }

      response.success = { resp, json ->
	      jsonResp=json
      }
    }
    jsonResp
  }

  def delete(def url) {
    def http = new HTTPBuilder("http://172.17.42.1:4321/${url}")
    def jsonResp
    http.request( DELETE ) { req ->

      response.success = { resp, json ->
        jsonResp=json
      }
    }
    jsonResp
  }

  def get(def url) {
    def jsonText = new URL("http://172.17.42.1:4321/${url}").text

    new JsonSlurper().parseText(jsonText)
  }

}
