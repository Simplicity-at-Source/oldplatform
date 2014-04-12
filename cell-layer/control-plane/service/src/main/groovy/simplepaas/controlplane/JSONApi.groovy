package simplepaas.controlplane

import groovy.json.JsonSlurper
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

/**
 * Created by david on 12/04/14.
 */
class JSONApi {

  def post(def url, def data = null) {
    def http = new HTTPBuilder("http://172.17.42.1:4321/${url}")
    def jsonResp
    http.request(Method.POST, ContentType.JSON) { req ->
      if (data) {
        body = data
      }

      response.success = { resp, json ->
        jsonResp = json
      }
    }
    jsonResp
  }

  def delete(def url) {
    def http = new HTTPBuilder("http://172.17.42.1:4321/${url}")
    def jsonResp
    http.request(Method.DELETE) { req ->

      response.success = { resp, json ->
        jsonResp = json
      }
    }
    jsonResp
  }

  def get(def url) {
    def jsonText = new URL("http://172.17.42.1:4321/${url}").text

    new JsonSlurper().parseText(jsonText)
  }

}
