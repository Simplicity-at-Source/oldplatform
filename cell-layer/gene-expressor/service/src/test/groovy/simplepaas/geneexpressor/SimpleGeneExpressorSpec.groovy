package simplepaas.geneexpressor

import groovy.json.JsonBuilder
import spock.lang.Specification

class SimpleGeneExpressorSpec extends Specification {

  JSONApi api = Mock(JSONApi)

  def "Deletion correctly kills orphaned services"() {
    given:
    def command = new SimpleGeneExpressor(api: api)

    when:
    command.removeDeletedGenes(
        []
    )

    then:
    1 * api.get(SimpleGeneExpressor.PHENOTYPE_MONITOR) >>
        [
            [id:"1234567890", inspection:[Name:"/cell-redis"]]
        ]
    1 * api.delete("${SimpleGeneExpressor.CONTROL_PLANE}/1234567890")
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
