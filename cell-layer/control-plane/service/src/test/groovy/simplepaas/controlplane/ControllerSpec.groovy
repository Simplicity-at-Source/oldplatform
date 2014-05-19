package simplepaas.controlplane

import groovy.json.JsonBuilder
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import simplepaas.controlplane.commands.CreateContainer
import simplepaas.controlplane.commands.DestroyContainer
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


    @Unroll
    def "starts task #commandClass"() {
        given:
            def command = Mock(commandClass)

            def jsonRequest = [
                    "name": "serviceX1",
                    "imageId": "123456"
            ]

            mockMVC = standaloneSetup(new ApiController("${commandName}": command)).build()

        when:
            def response = mockMVC.perform(MockMvcRequestBuilders.post(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(jsonRequest)))
            //Thread.sleep(1000)
            //def getResponse = mockMVC.perform(MockMvcRequestBuilders.get("/container/checkbuild/${jsonRequest.name}")

        then:
            //getResponse.andExpect(MockMvcResultMatchers.status().isOk())
            response.andExpect(MockMvcResultMatchers.status().isOk())
            1 * command.call( { it.imageId == "123456" })

        where:
            commandClass    || commandName              || url
            CreateContainer || "createContainerCommand" || "/container"
    }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
