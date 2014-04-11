
#OUTPUT=`curl -vvv -X POST http://172.17.42.1:4321/containers/create?name=sp_proxy2 -H "Content-Type: application/json" -d @docker_api.json`
curl -vvv -X POST http://172.17.42.1:4321/containers/create?name=sp_proxy2 -H "Content-Type: application/json" -d @docker_api.json


#curl -vvv -X POST http://172.17.42.1:4321/containers/$1/start -H "Content-Type: application/json" -d @docker_api_start.json
