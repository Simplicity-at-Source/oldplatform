package simplepaas.controlplane

import groovy.json.JsonBuilder
import spock.lang.Specification

class ListImagesSpec extends Specification {

  JSONApi api = Mock(JSONApi)

  def "Calls control-plane to get the info about the given images"() {
    given:
    def command = new ListImages(controlPlane: api)

    when:
    command()

    then:
    1 * api.get("/containers/json") >> [
            [Id:"7a5d7194dd932e1aa7e460d6a0c3717bb85d5f4b00554062dee270c427de680f"],
            [Id:"HHHHHHHHHH"]
    ]

    1 * api.get("/containers/7a5d7194dd932e1aa7e460d6a0c3717bb85d5f4b00554062dee270c427de680f/json")
    1 * api.get("/containers/HHHHHHHHHH/json")
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
