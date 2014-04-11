package simplepaas.genestore

import groovy.json.JsonSlurper
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

@Controller
@Configuration
@EnableAutoConfiguration
class GeneController {

  @Autowired GeneStore store

  @RequestMapping(value="/", method = RequestMethod.POST)
  @ResponseBody
  def insertGene(@RequestBody String json) {
    convertFailure {  store.create(fromJson(json)) }
  }

  @RequestMapping(value="/", method = RequestMethod.GET)
  @ResponseBody
  def listGenes() {
    convertFailure { store.list() }
  }

  @RequestMapping(value="/{geneId}", method = RequestMethod.DELETE)
  @ResponseBody
  def destroyGene(@PathVariable(value = "geneId") String containerId) {
    convertFailure { store.remove(containerId) }
  }

  @Bean GeneStore store() { new GeneStore() }

  static void main(String[] args) throws Exception {
    SpringApplication.run(GeneController, args);
  }

  static fromJson(json) {
    new JsonSlurper().parseText(json)
  }

  static convertFailure(Closure cl) {
    try {
      return cl()
    } catch (Exception ex) {
      ex.printStackTrace()
      return [failure:ex.message]
    }
  }
}
