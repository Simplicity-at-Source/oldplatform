 #!/bin/bash

PWD=`pwd`
BASEDIR=`dirname $0`

cd $BASEDIR/service
./gradlew bootRepackage

cd ..

docker build --tag=sp_platform/spi_control_plane .


cd $PWD
