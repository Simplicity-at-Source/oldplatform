#!/bin/sh



curl -vvv -X POST http://172.17.0.4:8080/service/gene-store/substore/cell -d '{ "id": "simplenode2", "image": "sp_platform/uber-any", "env": { "GIT_REPO_URL": "https://github.com/fuzzy-logic/simplenode.git", "DNSHOST": "simplenode.muon.cistechfutures.net" } }' -H 'Content-Type: application/json'


#sleep 10

#IPADDR=`docker inspect 5cf8be02bd5b | grep -i IPAddress | awk -F\" '{print $4}'`

#curl -vvv -X GET http://$IPADDR:8080/
