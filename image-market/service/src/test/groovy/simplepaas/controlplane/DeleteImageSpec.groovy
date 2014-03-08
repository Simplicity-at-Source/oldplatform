package simplepaas.controlplane

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import spock.lang.Specification

class DeleteImageSpec extends Specification {

  JSONApi api = Mock(JSONApi)

  def "Removes the image from the sp-image repository"() {
    given:
    def command = new DeleteImage(dockerApi: api)

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
