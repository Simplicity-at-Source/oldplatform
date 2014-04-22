package simplepaas.genestore

import groovy.json.JsonSlurper
import spock.lang.Specification

/**
 * Created by gawain on 22/04/2014.
 */
class GeneStoreSpec extends Specification {


    def "test store"() {
        given:
            GeneStore geneStore = new GeneStore()
            def service1json = new JsonSlurper().parseText("""{"id": "riak-genesis", "image": "sp-platform/spi-riak"}""");
            def service2json = new JsonSlurper().parseText("""{"id": "riak-build-server", "image": "sp-platfomr/spi-riak"}""");


        when:
            def result1 = geneStore.create("riak", service1json)
            def result2 = geneStore.create("riak", service2json)

        then:
            ! result1.toString().contains("error")
            ! result2.toString().contains("error")
            println("geneStore.listAll(): ${geneStore.listAll()}");
            geneStore.listAll().get("riak").get("riak-genesis").get("id") == "riak-genesis"
            geneStore.listAll().get("riak").get("riak-build-server").get("id") == "riak-build-server"
    }
}
