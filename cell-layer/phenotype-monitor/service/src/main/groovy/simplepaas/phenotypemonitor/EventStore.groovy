package simplepaas.phenotypemonitor

class EventStore {

  def HEARTBEAT = 120000

  def events = []

  void leftShift(def status) {
    println "Processing ${status}"
    status.collect {
      new HashMap(it)
    }.each {
        it["time"] = System.currentTimeMillis()
        events << it
    }
  }

  List getCurrentStatus() {

    def expiringEvents = new HashMap(events)

    expiringEvents = expireEvents(expiringEvents)

    def status = [:]
    expiringEvents.each {
      status[it.id] = it
    }

    events = expiringEvents

    status.values().sort {
      it.id
    }
  }

  def expireEvents(def events) {
    events.findAll {
      it.time + HEARTBEAT > System.currentTimeMillis()
    }
  }
}
