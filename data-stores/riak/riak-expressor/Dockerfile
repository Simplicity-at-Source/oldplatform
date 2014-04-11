 
FROM sp_platform/spi_java

MAINTAINER Simplicity Itself

ENV PROVIDES sp-riak-expressor:8080

ADD container/run.sh /
ADD service/build/libs/sp-riak-expressor-0.1.jar /

RUN chmod 755 /run.sh

EXPOSE 8080

ENTRYPOINT /run.sh
