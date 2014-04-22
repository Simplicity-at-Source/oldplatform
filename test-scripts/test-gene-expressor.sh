#!/bin/sh

echo
echo ******************************************************************
echo Testing proxy to control-plane...
echo ******************************************************************
echo
#curl -X GET http://localhost:8080/ -H 'Host: sp-gene-expressor' | json_pp
curl -X GET http://localhost:8888/spapi/sp-cell_expressor/container | json_pp
