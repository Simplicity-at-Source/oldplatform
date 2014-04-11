package simplepaas.genestore

class GeneStore {

  def genes = [:]

  def create(def json) {
    //TODO, enforce a schema...
    genes[json.id] = new HashMap(json)
    ["Gene Created"]
  }

  def list() {
    genes.values()
  }

  def remove(def id) {
    genes.remove(id)
  }

}
