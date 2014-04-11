package simplepaas.controlplane

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import spock.lang.Specification

class CreateContainerSpec extends Specification {

  JSONApi api = Mock(JSONApi)

  def "Correctly calls the docker API"() {
    given:
    def command = new CreateContainer(dockerApi: api)
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

  def "Correctly interprets the dependency info to build ENV"() {
    given:
    def command = new CreateContainer(dockerApi: api)

    def jsonResponse = [
            containerId: "789456",
            dependencies: [
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
    def env = command.getEnvironmentVariables(jsonResponse)

    then:
    env.size() == 4
    env[0] == "postgres_PORT=746578"
    env[1] == "postgres_HOST=172.40.1.3"
    env[2] == "wibbleApi_PORT=66666"
    env[3] == "wibbleApi_HOST=172.40.1.7"
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
