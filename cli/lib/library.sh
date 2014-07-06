
LIBDIR="$( cd "$( dirname "$0" )" && pwd )/lib" 

lookup_nucleus_ip() {

  local CONTROL_ID=$(docker ps |grep sp-nucleus| tr -s ' ' |cut -d ' ' -f 1)
  local CONTROL_IP=$(docker inspect $CONTROL_ID | $LIBDIR/json -l | egrep '\[0,"NetworkSettings","IPAddress"]' | cut -d '"' -f 6)
  echo $CONTROL_IP
}

boot_service() {
  local NUCLEUS=$(lookup_nucleus_ip)
  echo "Muon: Booting Service [$1]"

  ##connect to the control-plane
  NUCLEUS_STATUS=$(wait_for_nucleus)

  echo "Control plane [$CONTROL_PLANE] says $NUCLEUS_STATUS"
  
  if [ "$CNUCLEUS_STATUS" != "FAILED" ]; then
    PAYLOAD="{\"id\":\"sp-$1\",\"image\":\"sp_platform/spi_$1\",\"env\": {\"DNSHOST\": \"$1.$2\", \"MUON_DOMAIN\": \"$2\",\"MUON_CONTROL_PLANE_PORT\": \"8080\", \"MUON_CONTROL_PLANE_IP\": \"$CONTROL_PLANE\"}, \"dependencies\":[{\"dependency\":\"sp-control-plane\",\"host\":\"$CONTROL_PLANE\",\"port\":8080}]}"
    echo "Sending $PAYLOAD"
    RESPONSE=$(curl --silent -X PUT -H "Content-Type: application/json" -d "$PAYLOAD" http://$NUCLEUS:8080/resource/container/record/$1/type/gene)
    echo "Nucleus $RESPONSE"
  else
    echo "Muon: Nucleus is not accessible"
  fi

}

wait_for_nucleus() {

  CONTROL_PLANE=$(lookup_nucleus_ip)

  STATUSCODE=$(curl --silent --output /dev/null --write-out "%{http_code}" http://$CONTROL_PLANE:8080/)

  TRIES=0

  while [[ $STATUSCODE -ne "200" ]]; do

    sleep 1
    STATUSCODE=$(curl --silent --output /dev/null --write-out "%{http_code}" http://$CONTROL_PLANE:8080/)

    TRIES=$(($TRIES + 1))

    if [[ "$TRIES" -ge "45" ]]; then
      echo "FAILED"
      STATUSCODE="200"
    fi
  done

}
