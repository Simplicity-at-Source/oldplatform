 #!/bin/bash

cd service

./gradlew bootRepackage

cd ..

docker build --tag=spi-control-plane .