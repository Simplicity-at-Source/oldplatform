#!/bin/sh

if [ -z "$1" ] && [ "$1" != "-f" ]
then
  echo "this script will remove all containers, and any images with tag <none>"
  echo To run please run with -f force argument
  echo useage $0 -f
  exit 1
fi


sudo docker rm $(sudo docker ps -a -q)
sudo docker rmi $(sudo docker images | grep -i "<none>" | awk '{print $3}')
sudo docker rmi nodejs-image
sudo docker rmi sp_proxy
sudo docker rmi sp_registry

