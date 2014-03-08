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
class ImageRegistryController {

  @Autowired ListImages listImagesCommand
  @Autowired RegisterImage registerImageCommand
  @Autowired DeleteImage deleteImageCommand

  @RequestMapping(value="/image", method = RequestMethod.POST)
  @ResponseBody
  def createContainer(@RequestBody String json) {
    try {
      registerImageCommand(fromJson(json))
    } catch (Exception ex) {
      ex.printStackTrace()
      [failure:ex.message]
    }
  }

  @RequestMapping(value="/image", method = RequestMethod.GET)
  @ResponseBody
  def listContainer() {
    try {
      listImagesCommand()
    } catch (Exception ex) {
      ex.printStackTrace()
      [failure:ex.message]
    }
  }

  @RequestMapping(value="/image/{imageId}", method = RequestMethod.DELETE)
  @ResponseBody
  def destroyContainer(@PathVariable(value = "imageId") String imageId) {
    deleteImageCommand(imageId)
  }

  def fromJson(json) {
    new JsonSlurper().parseText(json)
  }

  @Bean JSONApi api() { new JSONApi() }
  @Bean RegisterImage createImageBean() { new RegisterImage() }
  @Bean DeleteImage destroyImageBean() { new DeleteImage() }
  @Bean ListImages listImagesBean() { new ListImages() }

  static void main(String[] args) throws Exception {
    SpringApplication.run(ImageRegistryController, args);
  }
}

class ListImages {
  @Autowired JSONApi controlPlane

  def call() {

    def dockerRet = controlPlane.get("/images?repo=sp-market")

    return dockerRet.collect {
      it.inspection = controlPlane.get("/containers/${it.Id}/json")
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

class DeleteImage {
  @Autowired JSONApi controlPlane

  def call(id) {

    def dockerRet = controlPlane.post("/containers/${id}/kill")
    dockerRet = controlPlane.delete("/containers/${id}")

    [message: "Container Destroyed"]
  }
}

class RegisterImage {
  @Autowired JSONApi controlPlane

  def call(json) {

    def dockerRet = controlPlane.post("/containers/create?name=${json.name}", new JsonBuilder([
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
  def controlPlaneApi

  JSONApi() {
    def host = System.getenv("sp-control-plane_HOST")
    def port = System.getenv("sp-control-plane_PORT")
    controlPlaneApi="http://${host}:${port}"

  }

  def post(def url, def data = null) {
    def http = new HTTPBuilder("${controlPlaneApi}/${url}")
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
    def http = new HTTPBuilder("${controlPlaneApi}/${url}")
    def jsonResp
    http.request( DELETE ) { req ->

      response.success = { resp, json ->
        jsonResp=json
      }
    }
    jsonResp
  }

  def get(def url) {
    def jsonText = new URL("${controlPlaneApi}/${url}").text

    new JsonSlurper().parseText(jsonText)
  }

}
