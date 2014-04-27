FROM sp_platform/spi_base

MAINTAINER Simplicity Itself


ADD addfs/ /spaas
WORKDIR /spaas

RUN git clone https://github.com/fuzzy-logic/sentanal.git project
RUN cd project
RUN ./run.sh
EXPOSE 8080
