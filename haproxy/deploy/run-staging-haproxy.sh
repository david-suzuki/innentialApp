#!/bin/bash
################ INPUT VARS ##############
TARGET=$1
SSH_KEY=$2
PASSW=$3
NO_BUILD=$4
HOST_STRING=$5
VERBOSE=$7
##########################################

################ CONFIG VARS #############
source ./deploy/config.sh
COUNTER=0
#########################################

CURRENT_DIR="$(pwd)"

############## LOCAL VARS #############
APP_NAME=$STAGING_APP_NAME

#####
DEFAULT_SSH_KEY=$STAGING_DEFAULT_SSH_KEY
SERVER_NAME="${APP_NAME}_server"
SSH_CONN=$STAGING_SERVER_USER@$STAGING_SERVER_HOST

####
DOCKER_NETWORK=$APP_NAME-network
HAPROXY_DOCKER_NAME=$APP_NAME.haproxy
APP_DOCKER_NAME=$APP_NAME.app.nginx
ADMIN_DOCKER_NAME=$APP_NAME.admin.nginx
GRAPHQL_DOCKER_NAME=$APP_NAME.graphql.nginx
DOCKER_SERVER_ENV="-e SERVER_NAME=$STAGING_LABEL"
DOCKER_NETWORK="--network $DOCKER_NETWORK"
#########################################

################## BUILDING ####################
#echo 'TARGET' $TARGET
#echo 'SSH KEY' $SSH_KEY
#echo 'FORCE PASSWORD' $PASSW
#echo 'NO BUILD' $NO_BUILD

############## DOMAIN VARS #########
APP_DOMAIN=$STAGING_APP_DOMAIN
ADMIN_DOMAIN=$STAGING_ADMIN_DOMAIN
GRAPHQL_DOMAIN=$STAGING_GRAPHQL_DOMAIN
FORCE_SSL=""
############################################
if [ "$STAGING_FORCE_SSL" == 'true' ]; then
  FORCE_SSL="redirect scheme https code 301"
fi

################## BUILDING ####################
echo "=> STEP #$((COUNTER = $COUNTER + 1)) Removing $TMP_DIR/$APP_NAME"
rm -Rf $TMP_DIR/$APP_NAME

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Creating $TMP_DIR/$APP_NAME"
mkdir $TMP_DIR/$APP_NAME
mkdir $TMP_DIR/$APP_NAME/$PROXY_BUNDLE

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Copying docker tools to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE"
cp "$CURRENT_DIR/$DOCKER_TOOLS/docker-clean.sh" $TMP_DIR/$APP_NAME/$PROXY_BUNDLE
cp "$CURRENT_DIR/$DOCKER_TOOLS/docker-superclean.sh" $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/superclean.sh

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Moving to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE"
cd /$TMP_DIR/$APP_NAME/$PROXY_BUNDLE

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Creating Dockerfile for NGINX..."
cat > haproxy.cfg <<EOF
defaults
  default-server init-addr last,libc,none
  maxconn 1000
  mode http
  log global
  option forwardfor
  option dontlognull # bind *:443 ssl crt .
  timeout http-request 5s
  timeout connect 5000
  timeout client 2000000 # ddos protection
  timeout server 2000000 # stick-table type ip size 100k expire 30s store conn_cur

frontend http-in
  bind *:80
  mode http
  $FORCE_SSL
  use_backend admin-servers_http  if { hdr(host) -i $ADMIN_DOMAIN }
  use_backend graphql-servers_http  if { hdr(host) -i $GRAPHQL_DOMAIN }
  use_backend app-servers_http  if { hdr(host) -i $APP_DOMAIN }


frontend https
  bind *:443
  mode tcp
  option tcplog
  tcp-request inspect-delay 5s
  tcp-request content accept if { req_ssl_hello_type 1 }
  use_backend graphql-servers_ssl if { req.ssl_sni -i $GRAPHQL_DOMAIN }
  use_backend admin-servers_ssl if { req.ssl_sni -i $ADMIN_DOMAIN }
  use_backend app-servers_ssl if { req.ssl_sni -i $APP_DOMAIN }

backend graphql-servers_ssl
  mode tcp
  balance roundrobin
  option ssl-hello-chk
  server server1 $GRAPHQL_DOCKER_NAME:443
backend graphql-servers_http
  balance roundrobin
  server server1 $GRAPHQL_DOCKER_NAME

backend admin-servers_ssl
  mode tcp
  balance roundrobin
  option ssl-hello-chk
  server server1 $ADMIN_DOCKER_NAME:443
backend admin-servers_http
  balance roundrobin
  server server1 $ADMIN_DOCKER_NAME

backend app-servers_ssl
  mode tcp
  balance roundrobin
  option ssl-hello-chk
  server server1 $APP_DOCKER_NAME:443 send-proxy check
  # send-proxy (and proxy_protocol on nginx) to get the real client ip
backend app-servers_http
  balance roundrobin
  server server1 $APP_DOCKER_NAME send-proxy check
  # send-proxy (and proxy_protocol on nginx) to get the real client ip
EOF

echo "=> STEP #$((COUNTER = $COUNTER + 1)) DOCKER FILES DONE!"


echo "=> STEP #$((COUNTER = $COUNTER + 1)) Creating $APP_NAME.tar.gz ..."
cd ..
[[ $VERBOSE = "true" ]] &&  tar czvf $APP_NAME.tar.gz bundle || tar czvf $APP_NAME.tar.gz bundle > /dev/null

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Uploading $APP_NAME.tar.gz to remote server..."
### CONDITIONAL SCP
if [ "$PASSW" == "_" ]; then
  CUSTOM_SSH_KEY=
  if [ "$SSH_KEY" != "_" ]; then
    CUSTOM_SSH_KEY=true
  fi
  if [ "$CUSTOM_SSH_KEY" == "true" ]; then
    echo '[INFO]: Using custom key path: ' $SSH_KEY
    scp -i $SSH_KEY -o 'IdentitiesOnly yes' $APP_NAME.tar.gz $SSH_CONN:/tmp
  elif [ "$SSH_KEY" == "_" ]; then
    if [ "$DEFAULT_SSH_KEY" != "" ]; then
      echo '[INFO]: Using default key path: ' $DEFAULT_SSH_KEY
      scp -i $DEFAULT_SSH_KEY -o 'IdentitiesOnly yes' $APP_NAME.tar.gz $SSH_CONN:/tmp
      else
      echo '[INFO]: Using password authentication connecting to the server'
      scp -o PubkeyAuthentication=no $APP_NAME.tar.gz $SSH_CONN:/tmp
    fi
  fi
  else
    echo '[INFO]: Using password authentication connecting to the server'
    scp -o PubkeyAuthentication=no $APP_NAME.tar.gz $SSH_CONN:/tmp
fi

##############

DEPLOYMENT="\

  cd /tmp && \
  echo '[SERVER]: Crunching ${APP_NAME}.tar.gz' && \
  tar zxvf ${APP_NAME}.tar.gz -C /tmp/ > /dev/null 2>&1 && cd /tmp/bundle && \
  
  mkdir -p ~/environment/haproxy ; \
  cp haproxy.cfg ~/environment/haproxy ; \

  echo '[SERVER]: Stopping [$HAPROXY_DOCKER_NAME] and removing their images' && \
  docker stop $HAPROXY_DOCKER_NAME ; \
  docker rm -f $HAPROXY_DOCKER_NAME ; \

  echo '[SERVER]: Starting all containers again.' && \
  docker run \
  --name ${APP_NAME}.haproxy \
  $DOCKER_NETWORK \
  --restart always \
  -p 80:80 -p 443:443 \
  -v ~/environment/haproxy:/usr/local/etc/haproxy:ro \
  -d haproxy:1.7 && \

  echo '[SERVER]: DOCKER Cleaner Just STARTED. Wait till all is cleaned' && \
  bash superclean.sh > /dev/null 2>&1 && \
  echo '[SERVER]: DOCKER Cleaner COMPLETED' ; \

  echo '[SERVER]: Last but not least, removing everything from /tmp' && \
  rm -R /tmp/$PROXY_BUNDLE | rm /tmp/${APP_NAME}.tar.gz ; \
  echo 'Well, that was one hell of a ride! We are done here. See you next time ;)' ; \
  "

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Unpacking and Deploying ${APP_NAME}.tar.gz from remote server..."

## CONDITIONAL SSH
if [ "$PASSW" == "_" ]; then
  CUSTOM_SSH_KEY=
  if [ "$SSH_KEY" != "_" ]; then
    CUSTOM_SSH_KEY=true
  fi
  if [ "$CUSTOM_SSH_KEY" == "true" ]; then
    echo '[INFO]:  Using custom key path: ' $SSH_KEY
    ssh -i $SSH_KEY -o 'IdentitiesOnly yes' $SSH_CONN $DEPLOYMENT
  elif [ "$SSH_KEY" == "_" ]; then
     if [ "$DEFAULT_SSH_KEY" != "" ]; then
           echo '[INFO]: Using default key path: ' $DEFAULT_SSH_KEY
           ssh -i $DEFAULT_SSH_KEY -o 'IdentitiesOnly yes' $SSH_CONN $DEPLOYMENT
         else
           echo '[INFO]: Using password authentication connecting to the server'
           ssh -o PubkeyAuthentication=no $SSH_CONN $DEPLOYMENT
     fi
  fi
  else
    echo '[INFO]: Using password authentication connecting to the server'
    ssh -o PubkeyAuthentication=no $SSH_CONN $DEPLOYMENT
fi
