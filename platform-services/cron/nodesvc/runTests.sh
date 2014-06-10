#!/bin/sh


export NODE_DEBUG=true
export PORT=8080

if [ -z "$1" ]
then
  mocha -R spec
else
   mocha -R spec -g $1
fi