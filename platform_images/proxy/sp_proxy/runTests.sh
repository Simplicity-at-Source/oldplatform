#!/bin/sh


export SP_DOCKER_HOST=localhost
export SP_DOCKER_PORT=14321
export SP_PROXY_PORT=18888

mocha -R spec
