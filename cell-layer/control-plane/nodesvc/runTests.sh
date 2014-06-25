#!/bin/sh


export NODE_DEBUG=true
export SP_DOCKER_PORT=14321
export SP_DOCKER_HOST=localhost
export MUON_NUCLEUS_PORT=18081
export MUON_NUCLEUS_HOST=localhost



if [ -z "$1" ]
then
  mocha -R spec
else
   mocha -R spec -g "$1"
fi
