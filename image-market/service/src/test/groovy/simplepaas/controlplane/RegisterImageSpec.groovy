package simplepaas.controlplane

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import spock.lang.Specification

class RegisterImageSpec extends Specification {

  JSONApi api = Mock(JSONApi)

  def "Correctly calls the control-plane to download and inspect the image"() {
    given:
    def command = new RegisterImage(dockerApi: api)

    def jsonRequest = [
            imageId: "123456",
            dependencies:  [
                    [
                            dependency:"postgres",
                            host:"172.40.1.3",
                            port:746578
                    ],
                    [
                            dependency:"wibbleApi",
                            host:"172.40.1.7",
                            port:66666
                    ]
            ]
    ]

    when:
    command(jsonRequest)

    then:
    1 * api.post("/containers/create", {
      def json = new JsonSlurper().parseText(it)
      json.Image == "123456" &&
      json.Env.find { it.contains("postgres") } != null
    }) >> [Id:"THEIDOFDOOM"]
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
