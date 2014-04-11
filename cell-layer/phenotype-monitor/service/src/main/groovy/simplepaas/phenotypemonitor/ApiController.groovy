package simplepaas.phenotypemonitor

import groovy.json.JsonSlurper
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

@Controller
@Configuration
@EnableAutoConfiguration
class ApiController {

  @Autowired EventStore eventStore

  @RequestMapping(value="/", method = RequestMethod.POST)
  @ResponseBody
  def addStatusEvent(@RequestBody String json) {
    convertFailure { eventStore << fromJson(json) }
  }

  @RequestMapping(value="/", method = RequestMethod.GET)
  @ResponseBody
  def getStatus() {
    convertFailure { eventStore.currentStatus }
  }

  @Bean EventStore eventStore() { new EventStore() }

  def fromJson(json) {
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

  static void main(String[] args) throws Exception {
    SpringApplication.run(ApiController, args);
  }
}
