
LIBDIR="$( cd "$( dirname "$0" )" && pwd )/lib" 

lookup_control-plane_ip() {

  local CONTROL_ID=$(docker ps |grep sp-control_plane| tr -s ' ' |cut -d ' ' -f 1)
  local CONTROL_IP=$(docker inspect $CONTROL_ID | $LIBDIR/json -l | egrep '\[0,"NetworkSettings","IPAddress"]' | cut -d '"' -f 6)
  echo $CONTROL_IP
}

boot_service() {
  local CONTROL_PLANE=$(lookup_control-plane_ip)
  echo "Simple PaaS: Booting Platform Service [$1] via control plane"

  ##connect to the control-plane
  CONTROL_PLANE_STATUS=$(wait_for_control_plane)

  echo "Control plane [$CONTROL_PLANE] says $CONTROL_PLANE_STATUS"
  
  if [ "$CONTROL_PLANE_STATUS" != "FAILED" ]; then
    PAYLOAD="{\"name\":\"sp-$1\",\"imageId\":\"sp_platform/spi_$1\",\"env\": {\"DNSHOST\": \"$1.$2\", \"DOMAIN\": \"$2\",\"MUON_CONTROL_PLANE_PORT\": \"8080\", \"MUON_CONTROL_PLANE_IP\": \"$CONTROL_PLANE\"}, \"dependencies\":[{\"dependency\":\"sp-control-plane\",\"host\":\"$CONTROL_PLANE\",\"port\":8080}]}"
    echo "Sending $PAYLOAD"
    RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d "$PAYLOAD" http://$CONTROL_PLANE:8080/container)
    echo "Control Plane says $RESPONSE"
  else
    echo "Simple PaaS: Local Control Plane is not accessible"
  fi

}

wait_for_control_plane() {

  CONTROL_PLANE=$(lookup_control-plane_ip)

  STATUSCODE=$(curl --silent --output /dev/null --write-out "%{http_code}" http://$CONTROL_PLANE:8080/container)

  TRIES=0

  while [[ $STATUSCODE -ne "200" ]]; do

    sleep 1
    STATUSCODE=$(curl --silent --output /dev/null --write-out "%{http_code}" http://$CONTROL_PLANE:8080/container)

    TRIES=$(($TRIES + 1))

    if [[ "$TRIES" -ge "45" ]]; then
      echo "FAILED"
      STATUSCODE="200"
    fi
  done

}
