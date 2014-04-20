#!/bin/sh


if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]
then
  echo "useage: $0 <servicename> <host ip> <port>"
  exit 0
fi

REGISTRY=http://localhost:8888
SERVICE_NAME=$1
HOST=$2
PORT=$3


URL=$REGISTRY/service/$SERVICE_NAME

echo curl -vvv -X POST $URL -d \'{'name': $SERVICE_NAME, 'port': $PORT, 'hosts': [$HOST:$PORT] }\'
curl -vvv -X POST $URL -d "{\"name\": \"$SERVICE_NAME\", \"port\": \"$PORT\", \"hosts\": [\"$HOST:$PORT\"] }"
