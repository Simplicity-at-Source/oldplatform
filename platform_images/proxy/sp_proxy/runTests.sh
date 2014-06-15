#!/bin/sh


export SP_PROXY_PORT=18888
export SP_REGISTRY_PORT=18081
export SP_REGISTRY_HOST=localhost


npm install

if [ -z "$1" ]
then
  mocha -R spec
else
  mocha -R spec -g "$1"
fi
