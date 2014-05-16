#!/bin/sh

echo
echo "*******************************************************************************"
cat /etc/issue
echo "-------------------------------------------------------------------------------"
mvn -version
echo "-------------------------------------------------------------------------------"
set
echo "-------------------------------------------------------------------------------"

echo "*******************************************************************************"
echo

if [ -n "$GIT_REPO_URL" ]
then
  cd /spaas 
  echo "checking out project:  $GIT_REPO_URL"
  git clone $GIT_REPO_URL project
else
  echo "No ENV Variable GIT_REPO_URL:"
fi
cd /spaas/project
echo "Running project build and deploy script ./run.sh redirecting output to  /spaas/build.log"
./run.sh > /spaas/build.log
