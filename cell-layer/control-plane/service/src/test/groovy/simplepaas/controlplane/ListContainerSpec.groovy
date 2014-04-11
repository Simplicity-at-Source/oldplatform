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
    api.get("/containers/wibble/json") >> [
            data:"inserted",
            Config: [Env:null]
    ]

    when:
    def ret = command()

    then:
    ret[0].inspection.data == "inserted"
  }

  def "Handle the PROVIDES env correctly"() {
    given:
    def command = new ListContainers(dockerApi: api)
    api.get("/containers/json") >> [
            [Id:"wibble"]
    ]
    api.get("/containers/wibble/json") >> [
            Config: [
                    Env:[
                    "HOME=/",
                    "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                    "PROVIDES=sp-control-plane:8080,sp-service-reg:9090"
            ]]
    ]

    when:
    def ret = command()

    then:
    ret[0].provides == [[name:"sp-control-plane", port:"8080"], [name:"sp-service-reg", port:"9090"]]
  }


  def json(map) {
    new JsonBuilder(map).toString()
  }
}
