 #!/bin/bash

cd service

./gradlew bootRepackage

cd ..

docker build --tag=sp_platform/spi_stateless_expressor .
