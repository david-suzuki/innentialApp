#!/bin/bash
################ INPUT VARS ##############
TARGET=$1
SSH_KEY=$2
PASSW=$3
NO_BUILD=$4
HOST_STRING=$5
NO_CACHE=$6
VERBOSE=$7
##########################################

############## LOCAL VARS #############
NGINX_DOCKER_NAME=$APP_NAME.nginx
NGINX_DOCKER_PORT=80
NGINX_DOCKER_SSL_PORT=443
PRERENDER_DOCKER_PORT=3000
#######################################

################ CONFIG VARS #############
source ./deploy/config/$TARGET.sh
COUNTER=0
#########################################

CURRENT_DIR="$(pwd)"
SETTINGS_DIR="$(dirname "$(pwd)")"/settings

######## FROM CONFIG ###############
SERVER_NAME="${APP_NAME}_server"
SSH_CONN=$SERVER_USER@$SERVER_HOST

###
DOCKER_NETWORK=$APP_NAME-network
PRERENDER_DOCKER_NAME=$APP_NAME.prerender
DOCKER_SERVER_ENV="-e SERVER_NAME=$LABEL"
DOCKER_NETWORK="--network $DOCKER_NETWORK"
#########################################

NGINX_MAPPED_PORTS=""
if [ $NGINX_EXPOSE = 'true' ]; then
  NGINX_MAPPED_PORTS="-p $NGINX_EXPOSED_PORT:$NGINX_DOCKER_PORT"
  if [ $NGINX_USE_SSL = 'true' ]; then
  NGINX_MAPPED_PORTS="-p $NGINX_EXPOSED_PORT:$NGINX_DOCKER_PORT -p $NGINX_EXPOSED_SSL_PORT:$NGINX_DOCKER_SSL_PORT"
  fi
fi
################## BUILDING ####################
#echo 'TARGET' $TARGET
#echo 'SSH KEY' $SSH_KEY
#echo 'FORCE PASSWORD' $PASSW
#echo 'NO BUILD' $NO_BUILD

################## BUILDING ####################
echo "=> STEP #$((COUNTER = $COUNTER + 1)) Removing $TMP_DIR/$APP_NAME"
rm -Rf $TMP_DIR/$APP_NAME

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Creating $TMP_DIR/$APP_NAME"
mkdir $TMP_DIR/$APP_NAME
mkdir $TMP_DIR/$APP_NAME/$PROXY_BUNDLE
mkdir $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE


NO_CACHE_OPTION="--no-cache"

if [ "$NO_CACHE" = '_' ]; then
  NO_CACHE_OPTION="";
fi

case "$NO_BUILD" in
  '_' | 'true')
    if [ "$NO_BUILD" = '_' ]; then
      echo "=> STEP #$((COUNTER = $COUNTER + 1)) Creating $DIR's build. Keep calm... this is the last one"
      ([ -f .env ] && (rm .env) || echo "[BUILD][ENV][INFO] removed stale '.env'") && \
      ([ -f env/.env.$TARGET ] && (cp env/.env.$TARGET .env) || echo "[BUILD][ENV][INFO] No 'env/.env.$TARGET found for this build'") && \
      ([[ $VERBOSE = "true" ]] && npm run build || npm run build > /dev/null)
    elif [ "$NO_BUILD" = 'true' ]; then
      echo "=> STEP #$((COUNTER = $COUNTER + 1)) By-passing $APP_NAME's build"
    fi
    echo "[Build Stage Completed]"
    echo ""
    ;;
  *)
    echo 'Invalid deployment options. Possible values: default, no-build'
    exit 0
    ;;
esac


echo "=> STEP #$((COUNTER = $COUNTER + 1)) Copying $DIR/$DIST_DIR to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE"
cp -R $CURRENT_DIR/$DIST_DIR $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE > /dev/null 2>&1

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Copying settings to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE"
# WIP | Double check following target dir
cp -R $SETTINGS_DIR $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE/$DIST_DIR


echo "=> STEP #$((COUNTER = $COUNTER + 1)) Copying nginx.conf file to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE"
cp $NGINX_CONF_PATH $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/nginx.conf.erb

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Copying docker tools to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE"
cp "$CURRENT_DIR/$DOCKER_TOOLS/docker-clean.sh" $TMP_DIR/$APP_NAME/$PROXY_BUNDLE
cp "$CURRENT_DIR/$DOCKER_TOOLS/docker-superclean.sh" $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/superclean.sh

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Moving to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE"
cd /$TMP_DIR/$APP_NAME/$PROXY_BUNDLE

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Creating Dockerfile for NGINX..."
cat > Dockerfile.nginx <<EOF
# Pull base image.
FROM nginx:$NGINX_DOCKER_VERSION
RUN apt-get update && apt-get install -y ruby-full
ENV APP_NAME $APP_NAME
ENV NGINX_DOCKER_PORT $NGINX_DOCKER_PORT
ENV NGINX_DOCKER_SSL_PORT $NGINX_DOCKER_SSL_PORT
ENV NGINX_BASIC_AUTH_ENABLED $NGINX_BASIC_AUTH_ENABLED
ENV GRAPHQL_SERVER_PORT $GRAPHQL_SERVER_PORT
ENV GRAPHQL_SERVER_HOST $GRAPHQL_SERVER_HOST
ENV GRAPHQL_SERVER_PROTOCOL $GRAPHQL_SERVER_PROTOCOL
ENV PRERENDER_DOCKER_NAME $PRERENDER_DOCKER_NAME
ENV PRERENDER_DOCKER_PORT $PRERENDER_DOCKER_PORT
ENV NGINX_DOCKER_NAME $NGINX_DOCKER_NAME
ENV APP_DOMAIN $APP_DOMAIN
ENV DEPLOY_ID $DEPLOY_ID
ENV APP_DIR $DIR
ENV SSL_CHALLENGE $SSL_CHALLENGE
ENV SSL_CERT $SSL_CERT
ENV SSL_KEY $SSL_KEY
ENV NGINX_FORCE_SSL $NGINX_FORCE_SSL
ENV NGINX_USE_SSL $NGINX_USE_SSL
ENV NGINX_USE_GZIP $NGINX_USE_GZIP
ENV NGINX_USE_PRERENDER $NGINX_USE_PRERENDER
ENV HAPROXY_PROTOCOL $HAPROXY_PROTOCOL
COPY nginx.conf.erb /etc/nginx/nginx.conf.erb
RUN erb /etc/nginx/nginx.conf.erb > /etc/nginx/nginx.conf
RUN printf "$NGINX_AUTH_USER:`openssl passwd $NGINX_AUTH_PASSWORD`\n" >> /etc/nginx/.htpasswd
ADD $BUNDLE/$DIST_DIR /var/www/html/$APP_NAME/$DEPLOY_ID/$DIR
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
DOCKER_PRERENDER_STEP=""

if [ $NGINX_USE_PRERENDER == "true" ]; then
  DOCKER_PRERENDER_STEP="echo 'FLUSHING PRERENDER CACHE....' ; docker stop $PRERENDER_DOCKER_NAME ; docker start $PRERENDER_DOCKER_NAME ;"
fi

DEPLOYMENT="\

  cd /tmp && \
  echo '[SERVER]: Crunching ${APP_NAME}.tar.gz' && \
  tar zxvf ${APP_NAME}.tar.gz -C /tmp/ > /dev/null 2>&1 && cd /tmp/bundle && \
  
  echo -n '[SERVER]: Building $NGINX_DOCKER_NAME image. This may take a while...' && \
  start=$SECONDS && \
  ([[ $VERBOSE = 'true' ]] && docker build $NO_CACHE_OPTION -f Dockerfile.nginx -t $NGINX_DOCKER_NAME . || docker build $NO_CACHE_OPTION -f Dockerfile.nginx -t $NGINX_DOCKER_NAME . > /dev/null 2>&1) && \
  echo ' built in $(( SECONDS - start )) seconds' && \
  

  echo 'Ensuring ssl files are ready to go' && \
  ([ -f ~/environment/$DIR/ssl/$SSL_KEY ] && echo 'SSL KEY FOUND' || echo 'SSL KEY NOT FOUND') && \
  ([ -f ~/environment/$DIR/ssl/$SSL_CERT ] && echo 'SSL CERTIFICATE FOUND' || echo 'SSL CERTIFICATE NOT FOUND') && \
  ([[ $SSL_CHALLENGE != 'false' ]] &&  stat -t ~/environment/$DIR/ssl/$SSL_CHALLENGE || echo 'SKIP SSL CHALLENGE CHECK') && \

  $DOCKER_PRERENDER_STEP \

  echo '[SERVER]: Stopping [$NGINX_DOCKER_NAME] and removing their images' && \
  docker stop $NGINX_DOCKER_NAME ; \
  docker rm -f $NGINX_DOCKER_NAME ; \

  echo '[SERVER]: Starting all containers again.' && \
  docker run --name $NGINX_DOCKER_NAME \
  -d $DOCKER_NETWORK \
  $NGINX_MAPPED_PORTS \
  --restart always \
  -v ~/environment/$DIR/ssl/:/etc/nginx/certs/:ro
  $NGINX_DOCKER_NAME && \

  echo '[SERVER]: DOCKER Cleaner Just STARTED. Wait till all is cleaned' && \
  bash superclean.sh > /dev/null 2>&1 && \
  echo '[SERVER]: DOCKER Cleaner COMPLETED' ; \
  ([ -f ~/environment/cloudflare/purge.sh ] && bash ~/environment/cloudflare/purge.sh && echo '[SERVER]: CF CACHE PURGE EXECUTED!' || echo '[SERVER]: NO CF CACHE TO PURGE') && \
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
