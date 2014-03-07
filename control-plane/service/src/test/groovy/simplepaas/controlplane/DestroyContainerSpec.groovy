package simplepaas.controlplane

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import spock.lang.Specification

class DestroyContainerSpec extends Specification {

  JSONApi api = Mock(JSONApi)

  def "Correctly calls the docker API"() {
    given:
    def command = new DestroyContainer(dockerApi: api)

    when:
    command("THECONTAINERID")

    then:
    1 * api.post("/containers/THECONTAINERID/kill")
    1 * api.delete("/containers/THECONTAINERID")
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
