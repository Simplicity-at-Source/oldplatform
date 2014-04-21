#!/bin/sh


export SP_DOCKER_HOST=localhost
export SP_DOCKER_PORT=4321

export SP_REGISTRY_HOST=localhost
export SP_REGISTRY_PORT=8888



mocha -R spec
