FROM ubuntu

RUN apt-get update -y
RUN apt-get install -y git-core
#RUN apt-get install -y nodejs
#RUN apt-get install -y npm
RUN apt-get install wget

RUN mkdir /spaas
WORKDIR /spaas
RUN wget http://nodejs.org/dist/v0.10.26/node-v0.10.26-linux-x64.tar.gz
RUN tar xvzf node-v0.10.26-linux-x64.tar.gz
RUN ln -sf node-v0.10.26-linux-x64 nodejs
RUN ln -sf /spaas/nodejs/bin/node /usr/bin/node
RUN ln -sf /spaas/nodejs/bin/npm /usr/bin/npm
#RUN ls -al /spaas/nodejs/bin/
#RUN ls -al /usr/bin/
