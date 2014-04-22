package simplepaas.genestore

class GeneStore {

  def classifiers = [:]

  def create(def classifier, def json) {
    if (!json.id) {
      return [error:"No id provided"]
    }

    def classifierGenes = classifiers[classifier]
    if (!classifierGenes) {
      classifiers[classifier] = [:]
      classifierGenes = classifiers[classifier]
    }

    classifierGenes[json.id] = new HashMap(json)
    ["Gene Created"]
  }

  def list(def classifier) {
    classifiers[classifier]?.values() ?: []
  }

   def listAll() {
        classifiers
   }

  def remove(def classifier, def id) {
    classifiers[classifier]?.remove(id)
    ["Gene Removed"]
  }

}
