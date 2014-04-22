package simplepaas.genestore

import groovy.json.JsonSlurper
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import spock.lang.Specification

import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup

/**
 * Created by gawain on 22/04/2014.
 */
class GeneControllerSpec extends Specification {

    MockMvc mockMVC
    GeneStore store = new GeneStore()

    def "test controller get / lists all classifiers"() {
        given:
            def json = new JsonSlurper().parseText("""{"id": "riak-genesis", "image": "sp-platform/spi-riak"}""");
            store.create("riak", json)
            mockMVC = standaloneSetup(new GeneController(store: store)).build()
        when:
        def response = mockMVC.perform(MockMvcRequestBuilders.get("/"))

        then:
            println("response: $response")
            response.andExpect(MockMvcResultMatchers.status().isOk())
            response.andExpect(MockMvcResultMatchers.content().contentType("application/json;charset=UTF-8"))
            response.andExpect(MockMvcResultMatchers.content().string("""{"riak":{"riak-genesis":{"id":"riak-genesis","image":"sp-platform/spi-riak"}}}"""))
    }
}
