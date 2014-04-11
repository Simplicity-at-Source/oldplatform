#!/bin/sh

echo
echo ******************************************************************
echo Testing proxy to control-plane...
echo ******************************************************************
echo
echo "curl -vvv -X GET http://localhost:8080/ -H 'Host: sp-gene-expressor'"
curl -X GET http://localhost:8080/ -H 'Host: sp-gene-expressor' | json_pp
