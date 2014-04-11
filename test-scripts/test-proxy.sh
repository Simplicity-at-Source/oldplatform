#!/bin/sh

echo
echo ******************************************************************
echo Testing proxy to control-plane...
echo ******************************************************************
echo
curl -vvv -X GET http://localhost:8080/container -H 'Host: sp-control-plane'
