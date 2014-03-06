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
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*

@Controller
@Configuration
@EnableAutoConfiguration
class ApiController {

  @Autowired
  CreateContainer createContainerCommand

  @RequestMapping("/container/create")
  @ResponseBody
  def createContainer(@RequestBody String json) {
    try {
      createContainerCommand(fromJson(json))
    } catch (Exception ex) {
      ex.printStackTrace()
      [failure:ex.message]
    }
  }

  @RequestMapping("/container/{containerId}/destroy")
  @ResponseBody
  def destroyContainer(String containerId) {

  }

  def fromJson(json) {
    new JsonSlurper().parseText(json)
  }

  @Bean JSONApi api() { new JSONApi() }
  @Bean RouterApi routerApi() { new RouterApi() }
  @Bean CreateContainer createContainerBean() { new CreateContainer() }

  static void main(String[] args) throws Exception {
    SpringApplication.run(ApiController, args);
  }
}

class CreateContainer {
  @Autowired JSONApi dockerApi
  @Autowired RouterApi routerApi

  def call(json) {

    def response = setupDependencies(json)

    def dockerRet = dockerApi.post("/containers/create", new JsonBuilder([
            "Image":json.imageId,
            "Env": getEnvironmentVariables(response)
    ]).toString())

    ["message": "Container created", id:dockerRet.Id]
  }

  def setupDependencies(json) {
    //instruct router to expose ports from existing containers for this one to access

    def dependencies = json.dependencies.collect {
      it
    }

    routerApi.post("/expose", new JsonBuilder(dependencies).toString())
  }

  List getEnvironmentVariables(json) {
    json?.dependencies?.collect {
      "${it.dependency}_PORT=${it.port}"
    }
  }
}

class JSONApi {

  def post(def url, def data) {
    def http = new HTTPBuilder("http://172.17.42.1:4321/${url}")
    def jsonResp
    http.request( POST, JSON ) { req ->
      body = data

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

class RouterApi {

  @Autowired JSONApi api

  def post(def url, def data) {
    //TODO, where should the router be running?
    //can this be looked up?

    def routerHost = getRouterHost()

    def http = new HTTPBuilder("http://${routerHost}:8080/${url}")
    def jsonResp
    http.request( POST, JSON ) { req ->
      body = data

      response.success = { resp, json ->
        jsonResp=json
      }
    }
    jsonResp
  }

  def getRouterHost() {
    def json = api.get("/containers/json")

    def localRouterContainer = json.find {
      it.Names.find { it == "/sp-router" }
    }

    if (!localRouterContainer) {
      throw new IllegalStateException("Router is not running on the local Docker. SimplePaaS will NOT run correctly in this state.")
    }
    def inspection = api.get("/containers/${localRouterContainer.Id}/json")

    inspection.NetworkSettings.IPAddress
  }

  def get(def url) {
    def jsonText = new URL("http://172.17.42.1:4321/${url}").text

    new JsonSlurper().parseText(jsonText)
  }

}

