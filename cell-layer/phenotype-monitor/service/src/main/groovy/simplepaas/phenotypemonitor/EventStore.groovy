package simplepaas.phenotypemonitor

class EventStore {

  def HEARTBEAT = 15000

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

    expireEvents()

    def status = [:]
    events.each {
      status[it.id] = it
    }
    status.values().sort {
      it.id
    }
  }

  def expireEvents() {
    events = events.findAll {
      it.time + HEARTBEAT > System.currentTimeMillis()
    }
  }
}
