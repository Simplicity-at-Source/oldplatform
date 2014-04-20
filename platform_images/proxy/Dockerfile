FROM sp_platform/spi_nodejs
RUN mkdir -p /proxy
ADD sp_proxy/ /proxy
WORKDIR /proxy
RUN /spaas/nodejs/bin/npm install
EXPOSE 8080
ENV SP_REGISTRY_HOST 172.17.0.6
ENTRYPOINT /spaas/nodejs/bin/node app.js
