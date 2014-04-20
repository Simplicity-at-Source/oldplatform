FROM sp_platform/spi_nodejs
RUN mkdir -p /proxy
ADD service/ /proxy
WORKDIR /proxy
RUN /spaas/nodejs/bin/npm install
EXPOSE 8888
ENTRYPOINT /spaas/nodejs/bin/node app.js
