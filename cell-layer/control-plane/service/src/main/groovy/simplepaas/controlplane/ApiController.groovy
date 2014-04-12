package simplepaas.controlplane

import groovy.json.JsonSlurper
import groovyx.net.http.HTTPBuilder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import simplepaas.controlplane.commands.CreateContainer
import simplepaas.controlplane.commands.DestroyContainer
import simplepaas.controlplane.commands.ListContainers
import simplepaas.controlplane.commands.ListImages

import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*


/*
add lop streaming.
  stderr
  stdout

add ability to download files
*/


@Controller
@Configuration
@EnableAutoConfiguration
@EnableScheduling
class ApiController {

  @Autowired CreateContainer createContainerCommand
  @Autowired DestroyContainer destroyContainerCommand
  @Autowired ListContainers listContainersCommand
  @Autowired ListImages listImagesCommand

  @Autowired JSONApi api

  @RequestMapping(value="/container", method = RequestMethod.POST)
  @ResponseBody
  def createContainer(@RequestBody String json) {
    convertFailure { createContainerCommand(fromJson(json)) }
  }

  @RequestMapping(value="/container", method = RequestMethod.GET)
  @ResponseBody
  def listContainer() {
    convertFailure { listContainersCommand() }
  }

  @RequestMapping(value="/container/{containerId}", method = RequestMethod.DELETE)
  @ResponseBody
  def destroyContainer(@PathVariable(value = "containerId") String containerId) {
    convertFailure { destroyContainerCommand(containerId) }
  }

  @RequestMapping(value="/images", method = RequestMethod.GET)
  @ResponseBody
  def listImages(@RequestParam(value="repo", required = false) String repo) {
    convertFailure { listImagesCommand() }
  }

  @Scheduled(fixedRate = 2000l)
  public void sendStatusToPhenotype() {
    def status = listContainersCommand()
    def http = new HTTPBuilder("http://172.17.0.4:8080/")
    def jsonResp
    http.request( POST, JSON ) { req ->
      body = status

      response.success = { resp, json ->
        jsonResp=json
      }
    }
  }

  def fromJson(json) {
    new JsonSlurper().parseText(json)
  }

  @Bean JSONApi api() { new JSONApi() }
  @Bean CreateContainer createContainerBean() { new CreateContainer() }
  @Bean DestroyContainer destroyContainerBean() { new DestroyContainer() }
  @Bean ListContainers listContainersBean() { new ListContainers() }
  @Bean ListImages listImagesBean() { new ListImages() }

  static convertFailure(Closure cl) {
    try {
      return cl()
    } catch (Exception ex) {
      ex.printStackTrace()
      return [failure:ex.message]
    }
  }

  static void main(String[] args) throws Exception {
    SpringApplication.run(ApiController, args);
  }
}





