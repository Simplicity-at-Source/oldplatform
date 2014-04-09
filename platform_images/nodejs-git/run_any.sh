export SERVICE_NAME=$1
export GIT_URL=$2
export SERVICE_PORT=$3
export EXPOSE_PORT=$4


if [ -z "$4" ]
then
 echo "USEAGE: $0 <SERVICENAME> <GIT_URL> <SERVICE_PORT> "
 echo "EXAMPLE: $0 simplenode https://github.com/fuzzy-logic/simplenode.git 3000 3001"
 exit 1
fi

./create.sh $SERVICE_NAME $GIT_URL $SERVICE_PORT $EXPOSE_PORT

echo "sudo docker run -p $SERVICE_POST:$EXPOSE_PORT -link sp_proxy:sp_proxy -name $SERVICE_NAME $SERVICE_NAME"


