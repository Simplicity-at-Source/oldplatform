#!/bin/sh

echo
echo ******************************************************************
echo Testing proxy to control-plane...
echo ******************************************************************
echo
#curl -X GET http://localhost:8080/container -H 'Host: sp-control-plane' | json_pp
curl -X GET http://localhost:8888/spapi/sp-control_plane/container
