package simplepaas.riakexpressor

import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled

@Slf4j
@Configuration
@EnableAutoConfiguration
@EnableScheduling
class RiakExpressor {

  public static final String GENE_STORE = "http://172.17.0.4:8080/service/gene-store/substore/riak"
  static CONTROL_PLANE = "http://172.17.0.2:8080/container"
  static PHENOTYPE_MONITOR = "http://172.17.0.4:8080/service/pokemon/substore/muon"
  static MARKER = "sp-riak"
  //for now, use a hardcoded image. Allow overriding at some point when we understand the base behaviour required.
  static RIAK_NODE_IMAGE = "sp_platform/spi_riak_node"

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
      !geneIds.find { it == name.toString() }
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

  def activateGenes(def genes) {

    genes.each {
      log.info "Activating $it"
      //TODO, handling dependencies...?
      def resp = api.post(CONTROL_PLANE, [
              name:"$MARKER-${it.id}".toString(),
              imageId:RIAK_NODE_IMAGE
      ])
      log.info "Control plane replies ${resp}"
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
    SpringApplication.run(RiakExpressor, args);
  }
}
