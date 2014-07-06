#!/bin/sh


export NUCLEUS_IP=`docker ps -a | grep -i nucleus | awk '{print $1}' | xargs docker inspect | grep -i ipaddress | awk -F\" '{print $4}'`
export NUCLEUS_IP=localhost



echo "*****************************************************************************"
echo "PUT http://$NUCLEUS_IP:8080/service/gene-store/substore/stateless/record/simplenode"
echo "*****************************************************************************"

curl -vvv -X PUT http://$NUCLEUS_IP:8080/resource/stateless/record/simplenode/type/gene -d @create-simplenode.json -H 'Content-Type: application/json'




