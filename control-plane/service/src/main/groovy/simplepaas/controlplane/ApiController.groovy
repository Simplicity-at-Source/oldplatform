package simplepaas.controlplane

import groovy.json.JsonSlurper
import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*

@Controller
class ApiController {

  def createContainer = new CreateContainer()

  @RequestMapping("/images")
  @ResponseBody
  def availableImages() {
    discoverImages()
  }

  @RequestMapping("/container/create")
  @ResponseBody
  def createContainer(@RequestParam(value = "imageId", required=true) String imageId) {
    createContainer(imageId)
  }

  @RequestMapping("/container/{containerId}/destroy")
  @ResponseBody
  def destroyContainer(String containerId) {
    destroyContainer(id)
  }
}

class CreateContainer {
  def api = new JSONApi()

  def call(String id) {



  }
}

class DiscoverImages {

  def api = new JSONApi()

  def getParsedData(image) {

    def json = api.get("images/${image.imageId}/json")

    def envVars = json.container_config.Env

    def requires = envVars.find { it.toLowerCase().startsWith("requires") }
    def provides = envVars.find { it.toLowerCase().startsWith("provides") }

    if (provides) {
      image.provides=provides?.split("=")[1]
    }
    if (requires) {
      image.requires=requires?.split("=")[1]
    }
    return requires || provides
  }

  def call() {
    def images = api.get("/images/json")

    return images.findAll{
        def json = api.get("images/${it.Id}/json")
	getEnvVarValue(it.Id, "requires") || getEnvVarValue(it.Id, "provides")
    }.collect {
        def inspection = api.get("images/${it.Id}/json")
	[name:it.RepoTags[0][0..it.RepoTags[0].lastIndexOf(":")-1], 
	 id:it.Id, 
         provides:getEnvVarValue(it.Id, "provides"), 
         requires:getEnvVarValue(it.Id, "requires")]
    }
  }

  def getEnvVarValue(image, name) {
    def json = api.get("images/${image}/json")
    json.container_config.Env.find { it.toLowerCase().startsWith(name) }?.split("=")?.getAt(1)
  }

}

class JSONApi {

  def post(def url, def data) {
    def http = new groovyx.net.http.HTTPBuilder("http://172.17.42.1:4321/${url}")    
    def jsonResp
    http.request( POST, JSON ) { req ->
      body = data

      response.success = { resp, json ->
	  jsonResp=json
      }
    }
  }

  def get(def url) {
    def jsonText = new URL("http://172.17.42.1:4321/${url}").text

    new JsonSlurper().parseText(jsonText)
  }

}


