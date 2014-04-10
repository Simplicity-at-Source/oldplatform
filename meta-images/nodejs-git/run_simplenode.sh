#!/bin/sh

VMIP=192.168.1.90

./run_any.sh simplenode https://github.com/fuzzy-logic/simplenode.git 3000 3001
./run_any.sh simplenode https://github.com/fuzzy-logic/simplenode.git 3000 3002
./run_any.sh simplenode https://github.com/fuzzy-logic/simplenode.git 3000 3003

curl -vvv -X POST http://localhost:8888/service/simplenode -d '{"name": "simplenode", "port": "3000", "hosts": ["192.168.1.90:3001", "192.168.1.90:3002", "192.168.1.90:3003"] }'


