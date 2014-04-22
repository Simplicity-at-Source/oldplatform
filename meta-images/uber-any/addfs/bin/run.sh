#!/bin/sh

if [ -n "$GIT_REPO_URL" ]
then
  cd /spaas 
  git clone $GIT_REPO_URL project
fi
cd /spaas/project
./run.sh
