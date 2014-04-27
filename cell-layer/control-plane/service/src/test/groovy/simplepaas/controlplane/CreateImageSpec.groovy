package simplepaas.controlplane

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import groovyx.net.http.HTTPBuilder
import simplepaas.controlplane.commands.CreateContainer
import simplepaas.controlplane.commands.CreateImage
import spock.lang.Specification

class CreateImageSpec extends Specification {

//  def "Correctly calls the docker API"() {
//    given:
//    def http = Mock(HTTPBuilder)
//    def command = new CreateImage(http: http)
//    def jsonRequest = [
//            name: "123456",
//            dockerfile: [
//                    [from: "ubuntu"],
//                    [run:"cd /"],
//                    [run:"cd /"],
//                    [env:[name:"something", value:"value"]],
//                    [add:[remote:"http://somelocation.com/wibble", local:"/home/wibble"]],
//                    [expose:4545],
//                    [entrypoint:"/something.sh"]
//            ]
//    ]
//
//    when:
//    command(jsonRequest)
//
//    then:
//    1 * api.postWithHeaders("/build?t=123456", ["Content-Type":"application/tar"], {
//      it.trim() == """
//FROM ubuntu
//RUN cd /spaas
//RUN cd /spaas
//ENV something value
//ADD http://somelocation.com/wibble /home/wibble
//EXPOSE 4545
//ENTRYPOINT /something.sh
//"""
//    }) >> [imageId: "THEIDOFDOOM"]
//  }

  def "so something awesome"() {
    given:
    def command = new CreateImage()
    def jsonRequest = [
            name: "123456",
            build: [
                    [from: "ubuntu"],
                    [run:"cd /"],
                    [run:"cd /"],
                    [env:[name:"something", value:"value"]],
                    [add:[remote:"http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js", local:"/"]],
                    [expose:4545],
                    [entrypoint:"/something.sh"]
            ]
    ]

    when:
    def ret = command(jsonRequest)

    then:
    ret.imageId != null
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
