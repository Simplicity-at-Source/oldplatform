 
FROM spi-java

MAINTAINER Simplicity Itself

ENV PROVIDES sp-image-registry:8080
ENV REQUIRES sp-control-plane

ADD container/run.sh /
ADD service/build/libs/sp-image-registry-0.1.jar /

RUN chmod 755 /run.sh

EXPOSE 8080

ENTRYPOINT /run.sh
