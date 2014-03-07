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
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.ResponseBody

import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*

@Controller
@Configuration
@EnableAutoConfiguration
class ApiController {

  @Autowired
  CreateContainer createContainerCommand

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

  @RequestMapping("/container/{containerId}/destroy")
  @ResponseBody
  def destroyContainer(String containerId) {

  }

  def fromJson(json) {
    new JsonSlurper().parseText(json)
  }

  @Bean JSONApi api() { new JSONApi() }
  @Bean CreateContainer createContainerBean() { new CreateContainer() }

  static void main(String[] args) throws Exception {
    SpringApplication.run(ApiController, args);
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
