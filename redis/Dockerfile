FROM        ubuntu:12.10
RUN         apt-get update
RUN         apt-get -y install redis-server
EXPOSE      6379
ENV PROVIDES redis:1.4
ENTRYPOINT  ["/usr/bin/redis-server"]
