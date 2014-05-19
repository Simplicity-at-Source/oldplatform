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
import simplepaas.controlplane.commands.CreateImage
import simplepaas.controlplane.commands.DestroyContainer
import simplepaas.controlplane.commands.ListContainers
import simplepaas.controlplane.commands.ListImages
import simplepaas.controlplane.commands.SendContainerInformation

import java.util.concurrent.Callable
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future

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

    private final ExecutorService execService = Executors.newFixedThreadPool(4);
    private Map containerBuilds = new HashMap()

  @Autowired CreateImage createImageCommand
  @Autowired CreateContainer createContainerCommand
  @Autowired DestroyContainer destroyContainerCommand
  @Autowired ListContainers listContainersCommand
  @Autowired ListImages listImagesCommand
  @Autowired SendContainerInformation containerInformation

  @Autowired JSONApi api



  @RequestMapping(value="/container", method = RequestMethod.POST)
  @ResponseBody
  def createContainer(@RequestBody String json) {

      def postJson = fromJson(json)
      Callable<Map> task = new Callable() {
          @Override
          Object call() throws Exception {
              createContainerCommand.call(postJson)

          }
      }
      Future<Map> taskFuture = execService.submit(task)
      containerBuilds.put(postJson.name, taskFuture)
    convertFailure { [message: "creating service ${postJson.name}", status: "/container/checkbuild/${postJson.name}"] }
  }

  @RequestMapping(value="/container", method = RequestMethod.GET)
  @ResponseBody
  def listContainer() {
      convertFailure { listContainersCommand.call() }
  }

    @RequestMapping(value="/container/checkbuild/{containerId}", method = RequestMethod.GET)
    @ResponseBody
    def listContainer(@PathVariable(value = "containerId") String containerId) {

        def returnMessage = [status: "Still Building..."]
        Future future = containerBuilds.get(containerId)
        if (future.isDone()) {
             returnMessage = [status: future.get()]
        }

        convertFailure {  }

    }

  @RequestMapping(value="/container/{containerId}", method = RequestMethod.DELETE)
  @ResponseBody
  def destroyContainer(@PathVariable(value = "containerId") String containerId) {
    convertFailure { destroyContainerCommand.call(containerId) }
  }

  @RequestMapping(value="/images", method = RequestMethod.GET)
  @ResponseBody
  def listImages(@RequestParam(value="repo", required = false) String repo) {
    convertFailure { listImagesCommand.call() }
  }

  @RequestMapping(value="/images", method = RequestMethod.POST)
  @ResponseBody
  def createImage(@RequestBody String json) {
    convertFailure { createImageCommand.call(fromJson(json)) }
  }

  @Scheduled(fixedRate = 2000l)
  public void sendStatusToPhenotype() {
    containerInformation.call()
  }

  def fromJson(json) {
    new JsonSlurper().parseText(json)
  }

  @Bean JSONApi api() { new JSONApi() }
  @Bean CreateContainer createContainerBean() { new CreateContainer() }
  @Bean DestroyContainer destroyContainerBean() { new DestroyContainer() }
  @Bean ListContainers listContainersBean() { new ListContainers() }
  @Bean ListImages listImagesBean() { new ListImages() }
  @Bean SendContainerInformation containerInformation() { new SendContainerInformation() }
  @Bean CreateImage createImage() { new CreateImage() }

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





