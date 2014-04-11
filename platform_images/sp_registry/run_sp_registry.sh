#!/bin/sh

./create.sh  sp_registry https://github.com/fuzzy-logic/sp_registry.git 8888 8888
#echo "sudo docker run -p 0.0.0.0:8888:8888 sp_registry"
sudo docker run -d -p 8888:8888  --tag=sp_platform/spi_sp_registry -name sp_platform/spi_sp_registry sp_registry &
sleep 3
curl -vvv -X POST http://localhost:8888/service/testservice -d '{"name": "testservice", "port": "80", "hosts": ["www.google.com"] }'


