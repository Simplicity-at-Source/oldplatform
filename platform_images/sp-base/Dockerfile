FROM ubuntu

MAINTAINER Simplicity Itself


RUN apt-get update -y
#RUN apt-get upgrade -y
RUN apt-get install -y git-core

RUN apt-get install -y curl unzip openjdk-6-jdk wget

RUN mkdir /spaas
WORKDIR /spaas
RUN wget http://nodejs.org/dist/v0.10.26/node-v0.10.26-linux-x64.tar.gz
RUN tar xvzf node-v0.10.26-linux-x64.tar.gz
RUN ln -sf node-v0.10.26-linux-x64 nodejs
RUN ln -sf /spaas/nodejs/bin/node /usr/bin/node
RUN ln -sf /spaas/nodejs/bin/npm /usr/bin/npm

RUN echo Java Version:
RUN java -version
RUN echo node version:
RUN node -v
RUN find /spaas

