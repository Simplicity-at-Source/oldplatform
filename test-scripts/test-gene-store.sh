#!/bin/sh

echo
echo ******************************************************************
echo Testing proxy to control-plane...
echo ******************************************************************
echo
#curl -X GET http://localhost:8080/ -H 'Host: sp-gene_store' | json_pp



SERVICE_JSON='{ "id": "simplenode", "image": "sp_platform/uber-any", "env": { "GIT_REPO_URL": "https://github.com/fuzzy-logic/simplenode.git" } }'
#curl -X GET http://localhost:8888/spapi/config/cell

#curl -X POST http://localhost:8888/spapi/spapi/config/cell  -d "$SERVICE_JSON"
echo curl -vvv -X POST http://172.17.0.3:8080/cell  -d \'$SERVICE_JSON\'
#curl -vvv -X POST http://172.17.0.3:8080/cell  -d "$SERVICE_JSON"


echo curl -vvv -X GET http://172.17.0.3:8080/
