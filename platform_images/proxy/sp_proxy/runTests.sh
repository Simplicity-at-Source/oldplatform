#!/bin/sh


export SP_PROXY_PORT=18888
export MUON_GNS_PORT=18081
export MUON_GNS_HOST=localhost


npm install

if [ -z "$1" ]
then
  mocha -R spec
else
  mocha -R spec -g "$1"
fi
