package simplepaas.phenotypemonitor

import spock.lang.Specification

class EventStoreSpec extends Specification {

  def "Event store overlays new events on old ones"() {
    given:
    EventStore store = new EventStore()
    store << [
        [id:"wibble", hello:"Awesome", simple:"Wibble"],
        [id:"fibble", hello:"Awesome", simple:"Wibble"]
    ]

    when:
    store << [
        [id:"wibble", hello:"THIS IS COOL"],
        [id:"simplest", hello:"THIS IS COOL"]
    ]

    then:
    store.currentStatus.size() == 3
    with(store.currentStatus[0]) {
        it.id == "fibble"
        it.hello == "Awesome"
        it.simple == "Wibble"
    }
    with(store.currentStatus[1]) {
      it.id == "simplest"
      it.hello == "THIS IS COOL"
    }
    with(store.currentStatus[2]) {
      it.id == "wibble"
      it.hello == "THIS IS COOL"
    }
  }

  def "Event store expires events older than heartbeat"() {
    given:
    EventStore store = new EventStore(HEARTBEAT: 500)
    store << [
        [id:"wibble", hello:"Awesome", simple:"Wibble"],
        [id:"fibble", hello:"Awesome", simple:"Wibble"]
    ]

    when:
    Thread.sleep(100)
    store << [[id:"wibble", hello:"Awesome", simple:"sigh"],]

    and:
    Thread.sleep(400)

    store << [
        [id:"simplest", hello:"THIS IS COOL"]
    ]

    then:
    store.currentStatus.size() == 2
    store.currentStatus[0].id == "simplest"
    store.currentStatus[1].id == "wibble"
    store.currentStatus[1].id == "wibble"
  }

}
