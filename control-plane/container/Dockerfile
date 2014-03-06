 
FROM ubuntu:saucy

MAINTAINER Simplicity Itself

ENV REQUIRES switch

ADD boot.sh /
ADD run.sh /
ADD ApiController.groovy /

RUN chmod 755 /boot.sh
RUN chmod 755 /run.sh

RUN /boot.sh

EXPOSE 8080

ENTRYPOINT /run.sh
