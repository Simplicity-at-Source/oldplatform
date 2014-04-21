#!/bin/sh

echo
echo ******************************************************************
echo Testing proxy to control-plane...
echo ******************************************************************
echo
#curl -X GET http://localhost:8080/ -H 'Host: sp-gene_store' | json_pp
curl -X GET http://localhost:8888/spapi/sp-gene_store/container | json_pp
