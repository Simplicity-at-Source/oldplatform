package simplepaas.genestore

import groovy.json.JsonSlurper
import spock.lang.Specification

class GeneStoreSpec extends Specification {


    def "test store listall()"() {
        given:
            GeneStore geneStore = new GeneStore()
            def service1json = new JsonSlurper().parseText("""{"id": "riak-genesis", "image": "sp-platform/spi-riak"}""");
            def service2json = new JsonSlurper().parseText("""{"id": "riak-build-server", "image": "sp-platfomr/spi-riak"}""");


        when:
            def result1 = geneStore.create("riak", "123", service1json)
            def result2 = geneStore.create("riak", "321", service2json)

        then:
            ! result1.toString().contains("error")
            ! result2.toString().contains("error")
            println("geneStore.listAll(): ${geneStore.listAll()}");
            geneStore.listAll().get("riak").get("123").get("id") == "riak-genesis"
            geneStore.listAll().get("riak").get("321").get("id") == "riak-build-server"
    }
}
