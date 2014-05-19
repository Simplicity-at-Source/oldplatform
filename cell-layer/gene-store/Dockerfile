 
FROM sp_platform/spi_base

MAINTAINER Simplicity Itself

ENV PROVIDES sp-gene-store:8080

ADD container/run.sh /
ADD nodesvc /spaas/project

RUN chmod 755 /run.sh

EXPOSE 8080

ENTRYPOINT /spaas/project/run.sh
