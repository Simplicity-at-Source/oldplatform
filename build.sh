#!/bin/bash

COMPONENTS="platform_images cell-layer data-stores meta-images"

HERE=$(pwd)

for CP in $COMPONENTS 
do
  echo "Building $CP"
  cd $CP
  ./build.sh
  cd $HERE
done

echo "Simple PaaS:  Core components built and locally installed.  For a local development install, run cli/sp dev-init"
