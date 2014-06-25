 
FROM sp_platform/spi_base

MAINTAINER Simplicity Itself

ENV PROVIDES sp-gene-store:8080

ADD nodesvc /spaas/project

RUN chmod 755 /spaas/project/run.sh

EXPOSE 8080

WORKDIR /spaas/project
RUN npm install
ENTRYPOINT /bin/sh /spaas/project/run.sh
