 #!/bin/bash

cd service

./gradlew bootRepackage

cd ..

docker build --tag=sp-platform/spi-phenotype-monitor .
