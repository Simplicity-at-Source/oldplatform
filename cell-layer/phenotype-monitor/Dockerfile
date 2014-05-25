
FROM sp_platform/spi_base

MAINTAINER Simplicity Itself

ENV PROVIDES sp-phenotype-monitor:8080

ADD nodesvc /spaas/project

RUN chmod 755 /spaas/project/run.sh

EXPOSE 8080

WORKDIR /spaas/project
ENTRYPOINT /bin/sh /spaas/project/run.sh
