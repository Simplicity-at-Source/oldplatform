FROM sp_platform/spi_nodejs
RUN mkdir -p /proxy
ADD sp_proxy/ /proxy
WORKDIR /proxy
RUN /spaas/nodejs/bin/npm install
EXPOSE 8888
ENV SP_REGISTRY_HOST 172.17.0.5
ENTRYPOINT /spaas/nodejs/bin/node app.js
