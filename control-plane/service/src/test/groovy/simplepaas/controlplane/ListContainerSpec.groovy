package simplepaas.controlplane

import groovy.json.JsonBuilder
import spock.lang.Specification

class ListContainerSpec extends Specification {

  JSONApi api = Mock(JSONApi)

  def "Correctly calls the docker API"() {
    given:
    def command = new ListContainers(dockerApi: api)

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

  def "Blends the inspection into data"() {
    given:
    def command = new ListContainers(dockerApi: api)
    api.get("/containers/json") >> [
            [Id:"wibble"]
    ]
    api.get("/containers/wibble/json") >> [data:"inserted"]

    when:
    def ret = command()

    then:
    ret[0].inspection.data == "inserted"
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
