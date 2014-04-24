package simplepaas.geneexpressor

import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled

@Configuration
@EnableAutoConfiguration
@EnableScheduling
@Slf4j
class SimpleGeneExpressor {

  public static final String GENE_STORE = "http://172.17.0.3:8080/cell"
  static CONTROL_PLANE = "http://172.17.0.2:8080/container"
  static PHENOTYPE_MONITOR = "http://172.17.0.4:8080/"
  static MARKER = "cell"

  @Autowired JSONApi api

  @Scheduled(fixedRate = 5000l)
  public void heartbeat() {
    removeDeletedGenes(
        findApplicableGenes())

    activateGenes(
        findInactive(
          findApplicableGenes()))
  }

  def removeDeletedGenes(def genes) {
    def geneIds = genes.collect {
      "$MARKER-${it.id}"
    }

    log.info "Valid genes for this effector are : ${geneIds}"

    def runningServices = api.get(PHENOTYPE_MONITOR).findAll {
      name(it.inspection).startsWith("$MARKER-")
    }
    log.info "Existing services ${runningServices}"

    def orphanServices = runningServices.findAll {
      def name = name(it.inspection)
      log.info "Checking ${name} against $geneIds , contains? ${geneIds.find { name.toString() }}"
      !geneIds.find { name.toString() }
    }
    log.info "Orphaned services ${orphanServices.inspection.Name}"

    orphanServices.each {
      println "Service [${name(it.inspection)}] running without permission, nuking. ${CONTROL_PLANE}/${it.id}"
      def resp = api.delete("${CONTROL_PLANE}/${it.id}")
      println "Control plane replies ${resp}"
    }
  }

  static String name(def containerDef) {
    def name = containerDef.Name
    if (name) {
      return name[1..-1]
    }
    null
  }

  def activateGenes(def genes) {

    genes.each {
      println "Activating $it"
      def request = [
              name:"$MARKER-${it.id}".toString(),
              imageId:it.image.toString()
      ]
      if (it.env) {
        request.env = it.env
      }
      def resp = api.post(CONTROL_PLANE, request)
      println "Control plane replies ${resp}"
    }
  }

  def findInactive(def genes) {
    def runningServiceNames = api.get(PHENOTYPE_MONITOR).collect {
      it.inspection.Name[1..-1].toString()
    }
    genes.findAll {
      !runningServiceNames.contains("$MARKER-${it.id}".toString())
    }
  }

  def findApplicableGenes() {
    api.get(GENE_STORE).findAll {
      it.id
    }
  }

  @Bean JSONApi api() { new JSONApi() }

  def fromJson(json) {
    new JsonSlurper().parseText(json)
  }
  static void main(String[] args) throws Exception {
    SpringApplication.run(SimpleGeneExpressor, args);
  }
}

class JSONApi {

  def post(def url, def data = null) {
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
    def jsonText = new URL(url).text

    new JsonSlurper().parseText(jsonText)
  }

}
