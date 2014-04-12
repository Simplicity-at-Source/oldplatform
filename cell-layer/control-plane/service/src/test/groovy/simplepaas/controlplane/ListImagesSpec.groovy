package simplepaas.controlplane

import groovy.json.JsonBuilder
import simplepaas.controlplane.commands.ListImages
import spock.lang.Specification

class ListImagesSpec extends Specification {

  JSONApi api = Mock(JSONApi)

  def "Correctly calls the docker API"() {
    given:
    def command = new ListImages(dockerApi: api)

    when:
    command()

    then:
    1 * api.get("/images/json") >> [
            [Id:"7a5d7194dd932e1aa7e460d6a0c3717bb85d5f4b00554062dee270c427de680f"],
            [Id:"HHHHHHHHHH"]
    ]
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
