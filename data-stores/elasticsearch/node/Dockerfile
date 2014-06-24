FROM ubuntu:14.04

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get upgrade -y -q
RUN apt-get -y -q install wget curl && apt-get clean

# install Java 7
RUN wget --no-cookies --header 'Cookie: oraclelicense=accept-securebackup-cookie' http://download.oracle.com/otn-pub/java/jdk/7u55-b13/jdk-7u55-linux-x64.tar.gz
RUN tar zxf jdk-7u55-linux-x64.tar.gz; rm jdk-7u55-linux-x64.tar.gz
RUN mv jdk1.7.0_55 /opt
RUN update-alternatives --install '/usr/bin/java' 'java' '/opt/jdk1.7.0_55/bin/java' 9999
ENV JAVA_HOME /opt/jdk1.7.0_55

# Install Elasticsearch
ENV ES_VERSION 1.1.1
RUN wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-$ES_VERSION.deb
RUN dpkg -i elasticsearch-$ES_VERSION.deb && rm elasticsearch-$ES_VERSION.deb

ADD elasticsearch.yml /etc/elasticsearch/elasticsearch.yml
ADD logging.yml /etc/elasticsearch/logging.yml

# Setting the path.conf here makes sure logging and data paths set up correctly
ENTRYPOINT ["/usr/share/elasticsearch/bin/elasticsearch", "-Des.path.conf=/etc/elasticsearch"]
