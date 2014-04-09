include "apt"


Package { ensure => "installed" }

package {[ "git-core", "curl", "openjdk-6-jre-headless"]: }


exec { "apt-get update":
    command => "/usr/bin/apt-get update",
}

$pre_packages = [ "linux-image-generic-lts-raring", "linux-headers-generic-lts-raring" ]
package { $pre_packages: 
  require  => Exec['apt-get update'],
}


apt::source { 'docker':
  location          => 'http://get.docker.io/ubuntu',
  release           => 'docker',
  repos             => 'main',
  key               => '36A1D7869245C8950F966E92D8576A8BA88D21E9',
  key_server        => 'keyserver.ubuntu.com',
  include_src       => false
}


package {"lxc-docker": require => [Apt::Source['docker'], Exec['apt-get update']] }


#user { 'spadmin':
#  ensure => 'present',
#  home   => '/home/spadmin',
#  shell  => '/bin/bash',
#  managehome => true,
#}


#
# add dev.spaas.com to /etc/hosts file to point to localhost
#


# notify {'spadmin user created.':
#      require => User['spadmin'],
#    }


#file {'testfile':
#      path    => '/home/spadmin/testfile',
#      ensure  => present,
#      mode    => 0640,
#      content => "I'm a test file.",
#       subscribe => User['spadmin'],
#}

#notify {"I'm notifying you testfile created.":}


# git clone https://github.com/simplicityitself/simplepaas.git
