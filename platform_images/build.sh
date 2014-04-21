#!/bin/bash

COMPONENTS=$(ls -d */)

HERE=$(pwd)


cd  nodejs-image
./build.sh
cd $HERE

for CP in $COMPONENTS 
do
  echo "Building $CP"
  cd $CP
  ./build.sh
  cd $HERE
done

echo "Simple PaaS:  Platform Images built and locally installed."
