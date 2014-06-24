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


  static CONTROL_PLANE = "http://172.17.0.2:8080/container"

  static NUCLEUS_IP = System.getenv("MUON_NUCLEUS_IP");
  static NUCLEUS_PORT = System.getenv("MUON_NUCLEUS_PORT");

  static PHENOTYPE_MONITOR = "http://${NUCLEUS_IP}:${NUCLEUS_PORT}/service/pokemon/substore/muon"
  public static final String GENE_STORE = "http://${NUCLEUS_IP}:${NUCLEUS_PORT}/service/gene-store/substore/stateless"
  static MARKER = "stateless"


    public StatelessGeneExpressor() {
        log.info("nucleus url = ${PHENOTYPE_MONITOR}");
    }

  @Autowired JSONApi api

  @Scheduled(fixedRate = 10000l)
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
        def mylog = log
        (currentInstances - gene.count).times {

          def id = selectRandomInstance(gene).id
          mylog.info "Reaping $id"
          def ret = api.delete("${CONTROL_PLANE}/$id")
          mylog.info "Control Plane says ${ret}"
        }

      } else if (currentInstances < gene.count) {
        log.info "Will spin up new instances to meet requirements"

        (gene.count - currentInstances).times {
          def request = [
                  imageId: gene.image,
                  name: "${MARKER}-${gene.id}-${UUID.randomUUID()}".toString()
          ]
          if (gene.env) {
            request.env = gene.env
          }
          def ret = api.post(CONTROL_PLANE, request)

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
    log.info "counting instances for ${gene.id}"
    def results = api.get(PHENOTYPE_MONITOR);


      int logsize = 600;
      if (results) {
          if (results?.toString().length() < logsize) {
              logsize =  results.toString().length();
          }

          log.info("pokemon results: ${results.toString().substring(0, logsize)}" );
      } else {
          log.info("pokemon results empty" );
      }

      results.each {
          logsize = 300;
          if (it.toString().length() < logsize) {
              logsize =  it.toString().length();
          }
          if (it) {
              log.info("pokemon result: ${it.toString().substring(0, logsize)}" );
          } else {
              log.info("pokemon result empty" );
          }

      }


      def runningServiceNames = results.findAll {
      it.inspection
    }.collect {
      it.inspection.Name[1..-1].toString()
    }
    log.info "${gene.id} instance count ${runningServiceNames.size()}"
    runningServiceNames.findAll {
      it.startsWith "$MARKER-${gene.id}-".toString()
    }.size()
  }

  def removeDeletedGenes(def genes) {
      log.info "removing deleted genes..."
    def geneIds = genes.collect {
        log.info "removing  gene ${it.id}"
      "$MARKER-${it.id}"
    }

    log.info "Valid genes for this effector are : ${geneIds}"

    def runningServices = api.get(PHENOTYPE_MONITOR).findAll {
      it.inspection && name(it.inspection).startsWith("$MARKER-")
    }
    log.info "Existing services ${runningServices}"

    def orphanServices = runningServices.findAll {
      def name = name(it.inspection)
      log.info "Checking ${name} against $geneIds , contains? ${geneIds.find { name.toString() }}"
      !geneIds.find { name.toString() }
    }
    log.info "Orphaned services ${orphanServices.inspection.Name}"

    orphanServices.each {
      log.info "Service [${name(it.inspection)}] running without permission, nuking. ${CONTROL_PLANE}/${it.id}"
      def resp = api.delete("${CONTROL_PLANE}/${it.id}")
      log.info "Control plane replies ${resp}"
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
