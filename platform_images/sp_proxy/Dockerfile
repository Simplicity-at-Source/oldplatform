FROM sp_platform/spi_nodejs
WORKDIR /spaas
RUN git clone https://github.com/fuzzy-logic/sp_proxy.git
WORKDIR /spaas/sp_proxy
RUN /spaas/nodejs/bin/npm install
EXPOSE 8080
ENV SP_REGISTRY_HOST 172.17.0.6
ENTRYPOINT /spaas/nodejs/bin/node app.js
