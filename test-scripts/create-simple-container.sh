#!/bin/sh




echo "*****************************************************************************"
echo "PUT http://172.17.0.4:8080/service/gene-store/substore/stateless/record/simplenode"
echo "*****************************************************************************"

curl -vvv -X PUT http://localhost:8080/service/pokemon/substore/default/record/18172171231212 -d @create-simplenode.json -H 'Content-Type: application/json'



