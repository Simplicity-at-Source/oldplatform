#!/bin/bash

. /.gvm/bin/gvm-init.sh && gvm use springboot

#socat UNIX-LISTEN:/tmp/docker.sock,fork OPENSSL:$SERVERADDR:4321,cert=cert.pem,cafile=cert.pem,key=key.pem

export SERVERADDR="172.17.42.1"

#port forwarding tunnel
#socat UNIX-LISTEN:/tmp/docker.sock,fork TCP4:$SERVERADDR:4321&

spring run /ApiController.groovy
