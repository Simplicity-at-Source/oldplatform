

curl -vvv -X POST http://172.17.42.1:4321/containers/$1/start -H "Content-Type: application/json" -d @docker_api_start.json
