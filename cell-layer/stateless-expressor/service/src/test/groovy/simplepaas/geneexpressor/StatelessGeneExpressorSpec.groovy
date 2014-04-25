package simplepaas.geneexpressor

import groovy.json.JsonBuilder
import spock.lang.Specification

class StatelessGeneExpressorSpec extends Specification {

  JSONApi api = Mock(JSONApi)

  def "Correctly reaps surplus instances when required"() {
    given:
    def command = new StatelessGeneExpressor(api: api)

    and:
    api.get(StatelessGeneExpressor.PHENOTYPE_MONITOR) >>
            [
                    [id:"1234567890", inspection:[Name:"/stateless-my-service-KJHKJHKJHKJHKJ"]],
                    [id:"12345678945450", inspection:[Name:"/stateless-my-service-KJHKJHKJHKJH123"]],
                    [id:"123456789456453450", inspection:[Name:"/stateless-my-service-KJHKJHKJHKJ2342"]],
            ]

    when:
    command.manageInstanceCounts(
            [[id:"my-service", image:"my-image", count:1]]
    )

    then:

    2 * api.delete({
      it in [
              "${StatelessGeneExpressor.CONTROL_PLANE}/1234567890",
              "${StatelessGeneExpressor.CONTROL_PLANE}/12345678945450",
              "${StatelessGeneExpressor.CONTROL_PLANE}/123456789456453450"]
    })
  }

  def "Correctly starts new instances when required"() {
    given:
    def command = new StatelessGeneExpressor(api: api)

    when:
    command.manageInstanceCounts(
            [[id:"my-service", image:"my-image", count:5]]
    )

    then:
    1 * api.get(StatelessGeneExpressor.PHENOTYPE_MONITOR) >>
            [
                    [id:"1234567890", inspection:[Name:"/stateless-my-service-KJHKJHKJHKJHKJ"]],
                    [id:"12345678945450", inspection:[Name:"/stateless-my-service-KJHKJHKJHKJH123"]],
                    [id:"123456789456453450", inspection:[Name:"/stateless-my-service-KJHKJHKJHKJ2342"]],
            ]
    2 * api.post("${StatelessGeneExpressor.CONTROL_PLANE}", {
      it.name.startsWith("stateless-my-service-")
    })
  }

  def "Passes env information to control plane"() {
    given:
    def command = new StatelessGeneExpressor(api: api)

    when:
    command.manageInstanceCounts(
            [[
                    id:"my-service",
                    image:"my-image",
                    count:1,
                    env: [
                            "simple":"wibble",
                            "simple2":"wibble2"
                    ]
            ]]
    )

    then:
    api.get(StatelessGeneExpressor.PHENOTYPE_MONITOR) >> []

    1 * api.post("${StatelessGeneExpressor.CONTROL_PLANE}", {
              it.env == [
                "simple":"wibble",
                "simple2":"wibble2"
              ]
    })
  }

  def "Correctly counts running service instances"() {
    given:
    def command = new StatelessGeneExpressor(api: api)

    when:
    def count = command.countInstances([id:"my-service", image:"my-image", count:5])

    then:
    1 * api.get(StatelessGeneExpressor.PHENOTYPE_MONITOR) >>
            [
                    [id:"1234567890", inspection:[Name:"/stateless-my-service-KJHKJHKJHKJHKJ"]],
                    [id:"1234567890", inspection:[Name:"/stateless-my-service-rfg364trgedsarg"]],
                    [id:"1234567890", inspection:[Name:"/stateless-my-service-21423"]]
            ]

    count == 3
  }

  def "Deletion correctly kills orphaned services"() {
    given:
    def command = new StatelessGeneExpressor(api: api)

    when:
    command.removeDeletedGenes(
        []
    )

    then:
    1 * api.get(StatelessGeneExpressor.PHENOTYPE_MONITOR) >>
        [
            [id:"1234567890", inspection:[Name:"/stateless-redis"]]
        ]
    1 * api.delete("${StatelessGeneExpressor.CONTROL_PLANE}/1234567890")
  }

  def json(map) {
    new JsonBuilder(map).toString()
  }
}
