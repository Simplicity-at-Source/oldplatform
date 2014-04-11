#!/bin/sh

echo
echo ******************************************************************
echo Testing proxy to sp-phenotype-monitor...
echo ******************************************************************
echo
echo "curl -vvv -X GET http://localhost:8080/container -H 'Host: sp-phenotype-monitor'"
curl -X GET http://localhost:8080/ -H 'Host: sp-phenotype-monitor' | json_pp
