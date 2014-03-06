package simplepaas.controlplane

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import spock.lang.Specification

class CreateContainerSpec extends Specification {

  JSONApi api = Mock(JSONApi)
  RouterApi routerApi = Mock(RouterApi)

  def "Correctly calls the docker API"() {
    given:
    def command = new CreateContainer(dockerApi: api, routerApi: routerApi)
    routerApi.post(_, _ ) >> [
            dependencies: [[dependency:"POSTGRES", port:123456]]
    ]
    def jsonRequest = [
            imageId: "123456",
            dependencies: [
                    postgres:"7bc809cfee127e680bace099e247a9f13ef6c6661524d33b201e90896b509c43"
            ]
    ]

    when:
    command(jsonRequest)

    then:
    1 * api.post("/containers/create", {
      def json = new JsonSlurper().parseText(it)
      json.Image == "123456" &&
      json.Env.find { it.contains("POSTGRES") } != null
    })
  }

  def "Correctly calls the router API"() {
    given:
    def command = new CreateContainer(dockerApi: api, routerApi: routerApi)

    def jsonRequest = [
            imageId: "123456",
            dependencies: [
                    [
                            dependency:"postgres",
                            container:"7bc809cfee127e680bace099e247a9f13ef6c6661524d33b201e90896b509c43",
                            port:1234
                    ],
                    [
                            dependency:"wibbleApi",
                            container:"7bc809cfee127e680bace099e247a9f13ef6c6661524d33b201e90896b509c43",
                            port:7894
                    ]
            ]
    ]

    when:
    command(jsonRequest)

    then:
    1 * routerApi.post("/expose", {
      def json = new JsonSlurper().parseText(it)
      json[0].container == "7bc809cfee127e680bace099e247a9f13ef6c6661524d33b201e90896b509c43" &&
      json[0].port == 1234 &&
      json[1].container == "7bc809cfee127e680bace099e247a9f13ef6c6661524d33b201e90896b509c43"
      json[1].port == 7894
    })
  }

  def "Correctly interprets the router response to build ENV"() {
    given:
    def command = new CreateContainer(dockerApi: api, routerApi: routerApi)

    def jsonResponse = [
            containerId: "789456",
            dependencies: [
                    [
                            dependency:"postgres",
                            port:746578
                    ],
                    [
                            dependency:"wibbleApi",
                            port:66666
                    ]
            ]
    ]

    when:
    def env = command.getEnvironmentVariables(jsonResponse)

    then:
    env.size() == 2
    env[0] == "postgres_PORT=746578"
    env[1] == "wibbleApi_PORT=66666"
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
