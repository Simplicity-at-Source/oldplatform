package simplepaas.controlplane

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import simplepaas.controlplane.commands.CreateContainer
import spock.lang.Specification

class CreateContainerSpec extends Specification {

  JSONApi api = Mock(JSONApi)

  def "Correctly passes host and networking settings for sp_proxy"() {
    given:
    def command = new CreateContainer(dockerApi: api)
    def jsonRequest = [
            imageId: "sp_proxy",
            name: "sp_proxy",
    ]

    when:
    command(jsonRequest)

    then:
    1 * api.post("/containers/create?fromImage=sp_proxy&name=sp_proxy", {
      def json = new JsonSlurper().parseText(it)
    }) >> [Id: "abcdef123456"]

    1 * api.post("/containers/abcdef123456/start", {
      def json = new JsonSlurper().parseText(it)
      json.PortBindings."8888/tcp"[0].HostPort == "8888"
    }) >> [Id: "abcdef123456"]
  }

  def "Correctly calls the docker API"() {
    given:
    def command = new CreateContainer(dockerApi: api)
    def jsonRequest = [
            imageId: "123456",
            name: "awesome",
            dependencies: [
                    [
                            dependency: "postgres",
                            host: "172.40.1.3",
                            port: 746578
                    ],
                    [
                            dependency: "wibbleApi",
                            host: "172.40.1.7",
                            port: 66666
                    ]
            ]
    ]

    when:
    command(jsonRequest)

    then:
    1 * api.post("/containers/create?fromImage=123456&name=awesome", {
      def json = new JsonSlurper().parseText(it)
      json.Env.find { it.contains("postgres") } != null
    }) >> [Id: "THEIDOFDOOM"]
  }

  def "Correctly interprets the dependency info to build ENV"() {
    given:
    def command = new CreateContainer(dockerApi: api)

    def jsonResponse = [
            containerId: "789456",
            dependencies: [
                    [
                            dependency: "postgres",
                            host: "172.40.1.3",
                            port: 746578
                    ],
                    [
                            dependency: "wibbleApi",
                            host: "172.40.1.7",
                            port: 66666
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
