#!/bin/bash
apt-get update
apt-get upgrade -y
apt-get install -y curl unzip openjdk-6-jdk socat
curl -s get.gvmtool.net | bash
. /.gvm/bin/gvm-init.sh && gvm install springboot


