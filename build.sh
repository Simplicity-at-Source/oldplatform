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


export PATH=$PATH:`pwd`/cli

echo "add ./cli to your path with: export PATH=\$PATH:`pwd`/cli"

echo "Muon:  Core components built and locally installed.  For a local development install, run ./cli/dev-init"
