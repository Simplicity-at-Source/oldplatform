package simplepaas.controlplane.commands

import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method
import org.apache.commons.compress.archivers.tar.TarArchiveEntry
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream
import org.apache.http.HttpResponse
import org.apache.http.entity.ByteArrayEntity
import org.apache.http.entity.ContentType

@Slf4j
class CreateImage {

  def http = new HTTPBuilder("http://172.17.42.1:4321/")

  def call(Map json) {
    def bos = new ByteArrayOutputStream()

    def tos = new TarArchiveOutputStream(bos)

    byte[] dockerfile = createDockerFile(json)

    TarArchiveEntry entry = new TarArchiveEntry("Dockerfile")
    entry.setSize(dockerfile.length)
    tos.putArchiveEntry(entry)
    tos.write(dockerfile)
    tos.closeArchiveEntry();
    tos.flush()
    tos.close()

    def data = bos.toByteArray()

    http.encoder["application/tar"] = { byte[] tar ->
      new ByteArrayEntity(tar, ContentType.create("application/tar"))
    }

    def jsonResp  = [name:json.name]
    http.request(Method.POST) { req ->
      uri = "http://172.17.42.1:4321/build?t=${json.name}"
      send "application/tar", data

      response.success = {  HttpResponse resp ->

        def content = resp.entity.content.text

        def lines = content.split("\n")

        def end = lines.last()

        def last = new JsonSlurper().parseText(end)

        if (last.errorDetail) {
          jsonResp.errorDetail = last.errorDetail
          return
        }

        def id = last.stream[18..-2].trim()

        jsonResp.imageId = id
      }
    }
    jsonResp
  }

  byte[] createDockerFile(json) {
    def bos = new ByteArrayOutputStream()
    def writer = new OutputStreamWriter(bos)

    //todo schema enforcement?

    json.build.each {

      def command = (it.keySet() as List).first()
      def params = it[command]
      command = command.toUpperCase()

      switch(command) {
        case "FROM":
          writer.println "FROM ${params}"
          break
        case "RUN":
          writer.println "RUN ${params}"
          break
        case "ENV":
          writer.println "ENV ${params.name} ${params.value}"
          break
        case "ADD":
          writer.println "ADD ${params.remote} ${params.local}"
          break
        case "EXPOSE":
          writer.println "EXPOSE ${params}"
          break
        case "ENTRYPOINT":
          writer.println "ENTRYPOINT ${params}"
          break
        default:
          log.warn "Unknown docker instruction provided ${command}"
      }
    }

    writer.flush()
    writer.close()

    bos.toByteArray()
  }
}
