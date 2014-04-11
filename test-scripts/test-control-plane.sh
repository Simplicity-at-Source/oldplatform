#!/bin/sh

echo
echo ******************************************************************
echo Testing proxy to control-plane...
echo ******************************************************************
echo
echo "curl -vvv -X GET http://localhost:8080/container -H 'Host: sp-control-plane'"
curl -X GET http://localhost:8080/container -H 'Host: sp-control-plane' | json_pp
