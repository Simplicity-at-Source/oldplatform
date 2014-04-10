export SERVICE_NAME=$1
export GIT_URL=$2
export SERVICE_PORT=$3


if [ -z "$3" ]
then
 echo "USEAGE: $0 <SERVICENAME> <GIT_URL> <SERVICE_PORT> "
 echo "EXAMPLE: $0 simplenode https://github.com/fuzzy-logic/simplenode.git 3001"
 exit 1
fi

EXISTING_IMAGE=`sudo docker images | grep $SERVICE_NAME | awk '{print $1}'`

echo EXISTING_IMAGE: $EXISTING_IMAGE


if [ -z "$EXISTING_IMAGE" ]
then
  cat Dockerfile.template | envsubst > Dockerfile
  cat Dockerfile
  echo "RUNNING: sudo docker build -t $SERVICE_NAME . "
  sudo docker build -t $SERVICE_NAME . 
  mv Dockerfile Dockerfile.prev
fi




