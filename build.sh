#!/bin/bash

COMPONENTS="sp-java-ubuntu control-plane router service-discover-registry"

HERE=$(pwd)

for CP in $COMPONENTS 
do
  echo "Building $CP"
  cd $CP
  ./build.sh
  cd $HERE
done

echo "Simple PaaS:  Core components built and locally installed.  For a local development install, run cli/sp devinit"
