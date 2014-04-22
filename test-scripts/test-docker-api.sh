#!/bin/sh

echo
echo ******************************************************************
echo Testing docker api...
echo ******************************************************************
echo
 curl -X GET http://172.17.42.1:4321/containers/json | json_pp
