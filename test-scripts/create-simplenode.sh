#!/bin/sh




echo "*****************************************************************************"
echo "PUT http://172.17.0.4:8080/service/gene-store/substore/stateless/record/simplenode"
echo "*****************************************************************************"

curl -vvv -X PUT http://172.17.0.4:8080/service/gene-store/substore/stateless/record/simplenode -d @create-simplenode.json -H 'Content-Type: application/json'



