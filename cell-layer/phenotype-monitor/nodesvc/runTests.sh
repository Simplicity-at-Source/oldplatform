#!/bin/sh


export NODE_DEBUG=true
export PORT=8080

mocha -R spec
