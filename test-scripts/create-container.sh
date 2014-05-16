#!/bin/sh

curl -vvv -X POST http://172.17.42.1:4321/containers/create?name=sentiment -d '{ "Hostname":"ubersentiment", "Env":["GIT_REPO_URL=https://github.com/fuzzy-logic/sentanal.git"], "Image":"sp_platform/uber-any" }' -H 'Content-Type: application/json'
