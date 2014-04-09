#!/bin/sh

./create.sh  sp_proxy https://github.com/fuzzy-logic/sp_proxy.git 8080 8080
echo "sudo docker run -p 0.0.0.0:8080:8080 -link sp_registry:sp_registry sp_proxy"
sudo docker run -d -p 8080:8080 -link sp_registry:sp_registry -name sp_proxy sp_proxy &
sleep 3
curl -vvv -X GET http://localhost:8080/ -H 'Host: testservice'
