#!/bin/sh


export SP_DOCKER_HOST=localhost
export SP_DOCKER_PORT=4321

mocha -R spec
