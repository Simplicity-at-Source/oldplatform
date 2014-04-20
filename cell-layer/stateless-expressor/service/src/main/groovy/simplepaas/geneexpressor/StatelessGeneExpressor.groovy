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
class StatelessGeneExpressor {

  public static final String GENE_STORE = "http://172.17.0.3:8080/stateless"
  static CONTROL_PLANE = "http://172.17.0.2:8080/container"
  static PHENOTYPE_MONITOR = "http://172.17.0.4:8080/"
  static MARKER = "stateless"

  @Autowired JSONApi api

  @Scheduled(fixedRate = 5000l)
  public void heartbeat() {

    removeDeletedGenes(findApplicableGenes())

    manageInstanceCounts(findApplicableGenes())
  }

  def manageInstanceCounts(def genes) {
    //TODO, backoffs... inter cell cooperation.
    genes.each { gene ->
      def currentInstances = countInstances(gene)
      log.info "${gene.id}: [${currentInstances}] running, [${gene.count}] required"

      if (currentInstances > gene.count) {
        log.info "Will destroy excess instances"
        (currentInstances - gene.count).times {

          def id = selectRandomInstance(gene).id
          println "Reaping $id"
          def ret = api.delete("${CONTROL_PLANE}/$id")
          println "Control Plane says ${ret}"
        }

      } else if (currentInstances < gene.count) {
        log.info "Will spin up new instances to meet requirements"

        (gene.count - currentInstances).times {
          def ret = api.post(CONTROL_PLANE, [
                  imageId: gene.image,
                  name: "${MARKER}-${gene.id}-${UUID.randomUUID()}".toString(),
          ])
          println "Control Plane says [${ret}]"
        }
      }
    }
  }

  def selectRandomInstance(def gene) {
    def runningServices = api.get(PHENOTYPE_MONITOR).findAll {
      it.inspection.Name[1..-1].toString().startsWith "$MARKER-${gene.id}-".toString()
    }
    runningServices[new Random().nextInt(runningServices.size())]
  }

  def countInstances(def gene) {
    def runningServiceNames = api.get(PHENOTYPE_MONITOR).collect {
      it.inspection.Name[1..-1].toString()
    }
    runningServiceNames.findAll {
      it.startsWith "$MARKER-${gene.id}-".toString()
    }.size()
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

  def findApplicableGenes() {
    api.get(GENE_STORE).findAll {
      it.id
    }
  }

  @Bean JSONApi api() { new JSONApi() }

  static void main(String[] args) throws Exception {
    SpringApplication.run(StatelessGeneExpressor, args);
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
