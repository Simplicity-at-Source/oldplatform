 
FROM ubuntu:precise

MAINTAINER Simplicity Itself

ENV PROVIDES riak:8080

RUN sed -i.bak 's/main$/main universe/' /etc/apt/sources.list
RUN apt-get update
#This breaks :-(
#RUN apt-get upgrade -y

RUN apt-get install -y curl lsb-release supervisor openssh-server

RUN mkdir -p /var/run/sshd
RUN mkdir -p /var/log/supervisor

RUN locale-gen en_US en_US.UTF-8

ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf

#FIxe something going wrong..

RUN echo 'root:basho' | chpasswd
RUN curl -s http://apt.basho.com/gpg/basho.apt.key | apt-key add --
RUN echo "deb http://apt.basho.com $(lsb_release -cs) main" > /etc/apt/sources.list.d/basho.list
RUN apt-get update
# Install Riak and prepare it to run
RUN apt-get install -y riak
RUN sed -i.bak 's/127.0.0.1/0.0.0.0/' /etc/riak/app.config
RUN echo "ulimit -n 4096" >> /etc/default/riak
# Hack for initctl
# See: https://github.com/dotcloud/docker/issues/1024
RUN dpkg-divert --local --rename --add /sbin/initctl
#RUN ln -s /bin/true /sbin/initctl
# Expose Riak Protocol Buffers and HTTP interfaces, along with SSH
EXPOSE 8087 8098 22

CMD ["/usr/bin/supervisord"]
