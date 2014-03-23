#!/bin/sh

type vagrant
if [ "$?" -ne 0 ]
then
  echo "download & install vagrant from http://www.vagrantup.com/downloads.html"
  echo "Then re-run this script."
  exit
fi

sudo gem install puppet
puppet module install puppetlabs-apt
