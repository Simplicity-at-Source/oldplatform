package simplepaas.controlplane

import groovy.json.JsonBuilder
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import spock.lang.Unroll

import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*
import spock.lang.Specification

class ControllerSpec extends Specification {

  MockMvc mockMVC

  @Unroll
  def "post to #url delegated to #commandClass"() {
    given:
    def command = Mock(commandClass)

    def jsonRequest = [
            "imageId": "123456"
    ]

    mockMVC = standaloneSetup(new ApiController("${commandName}": command)).build()

    when:
    def response = mockMVC.perform(MockMvcRequestBuilders.post(url)
            .contentType(MediaType.APPLICATION_JSON)
            .content(json(jsonRequest)))

    then:
    response.andExpect(MockMvcResultMatchers.status().isOk())
    1 * command.call( { it.imageId == "123456" })

    where:
    commandClass    || commandName              || url
    CreateContainer || "createContainerCommand" || "/container"
  }

  @Unroll
  def "delete to #url delegated to #commandClass"() {
    given:
    def command = Mock(commandClass)

    mockMVC = standaloneSetup(new ApiController("${commandName}": command)).build()

    when:
    def response = mockMVC.perform(MockMvcRequestBuilders.delete(url))

    then:
    response.andExpect(MockMvcResultMatchers.status().isOk())
    1 * command.call("12345")

    where:
    commandClass     || commandName              || url
    DestroyContainer || "destroyContainerCommand" || "/container/12345"
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
