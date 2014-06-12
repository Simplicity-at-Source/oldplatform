package simplepaas.riakexpressor

import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

@Slf4j
class JSONApi {

  def post(def url, def data = null) {
    log.info("POST $url");
    def http = new HTTPBuilder(url)
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
    log.info("DELETE $url");
    def http = new HTTPBuilder(url)
    def jsonResp
    http.request(Method.DELETE) { req ->

      response.success = { resp, json ->
        jsonResp = json
      }
    }
    jsonResp
  }

  def get(def url) {
      log.info("GET $url");
    def jsonText = new URL(url).text

    new JsonSlurper().parseText(jsonText)
  }

}