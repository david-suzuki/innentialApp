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

################ CONFIG VARS #############
source ./deploy/config/$TARGET.sh
COUNTER=0
#########################################

CURRENT_DIR="$(pwd)"

############## LOCAL VARS #############
APP_NAME=$APP_NAME

#####
DEFAULT_SSH_KEY=$DEFAULT_SSH_KEY
SSH_CONN=$SERVER_USER@$SERVER_HOST

####
SSL_CHALLENGE=$SSL_CHALLENGE
SSL_CERT=$SSL_CERT
SSL_KEY=$SSL_KEY

####
HAPROXY_PROTOCOL=$HAPROXY_PROTOCOL

####
DOCKER_NETWORK=$APP_NAME-network
GRAPHQL_DOCKER_NAME=$APP_NAME.graphql
NGINX_DOCKER_PORT=80
NGINX_DOCKER_SSL_PORT=443
NGINX_DOCKER_NAME=$APP_NAME.graphql.nginx
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

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Copying $DIR to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE and renaming to $APP_NAME"
cp -R ./$DIST_DIR $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE/$APP_NAME > /dev/null
cp -R ./package.json $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE/$APP_NAME/package.json

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Copying settings to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE"
cp -R "../settings" $TMP_DIR/$APP_NAME/$PROXY_BUNDLE

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Copying migration settings and folder to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE"
cp -R "./migrations" $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE/$APP_NAME
cp "./migrate-mongo-config.js" $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE/$APP_NAME/

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Copying nginx.conf file to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE"
cp $NGINX_CONF_PATH $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/nginx.conf.erb

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Copying lookenv config to $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE/$APP_NAME/"
cp -R "./$LOOKENV_PATH" $TMP_DIR/$APP_NAME/$PROXY_BUNDLE/$BUNDLE/$APP_NAME/lookenv.config.js

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
ENV GRAPHQL_DOCKER_NAME $GRAPHQL_DOCKER_NAME
ENV GRAPHQL_DOCKER_PORT $GRAPHQL_DOCKER_PORT
ENV GRAPHQL_DOMAIN $GRAPHQL_DOMAIN
ENV SSL_CHALLENGE $SSL_CHALLENGE
ENV SSL_CERT $SSL_CERT
ENV SSL_KEY $SSL_KEY
ENV DEPLOY_ID=$DEPLOY_ID
ENV NGINX_FORCE_SSL $NGINX_FORCE_SSL
ENV NGINX_USE_SSL $NGINX_USE_SSL
ENV NGINX_USE_GZIP $NGINX_USE_GZIP
ENV HAPROXY_PROTOCOL $HAPROXY_PROTOCOL
COPY nginx.conf.erb /etc/nginx/nginx.conf.erb
RUN erb /etc/nginx/nginx.conf.erb > /etc/nginx/nginx.conf
EOF

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Creating Dockerfile for Apollo Server"
cat > Dockerfile.apollo <<EOF
# Pull base image.
FROM node:$NODE_DOCKER_VERSION

# Global install yarn package manager
RUN apt-get update && apt-get install -y curl apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo 'deb https://dl.yarnpkg.com/debian/ stable main' | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY settings /usr/settings
COPY $BUNDLE/$APP_NAME /usr/src/app

# Install dependencies
RUN yarn install --production

EXPOSE $GRAPHQL_DOCKER_PORT

CMD [ "yarn", "$START_COMMAND" ]
EOF

echo "=> STEP #$((COUNTER = $COUNTER + 1)) DOCKER FILES DONE!"

echo "=> STEP #$((COUNTER = $COUNTER + 1)) Creating $APP_NAME.tar.gz ..."
cd ..
[[ $VERBOSE = "true" ]] &&  tar czvf $APP_NAME.tar.gz bundle || tar czvf $APP_NAME.tar.gz bundle > /dev/null
echo "=> STEP #$((COUNTER = $COUNTER + 1)) Uploading $APP_NAME.tar.gz to remote server..."

### CONDITIONAL CONNECTION_STRING
if [ "$HOST_STRING" != "_" ]; then
    SSH_CONN=$HOST_STRING
fi
echo '[INFO]: Connecting to: ' $SSH_CONN
######################

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
  ([[ $VERBOSE = 'true' ]] && tar zxvf ${APP_NAME}.tar.gz -C /tmp/ || tar zxvf ${APP_NAME}.tar.gz -C /tmp/ > /dev/null) && cd /tmp/bundle && \
  echo '[SERVER]: Copying env vars to current working directory' && \
  cp ~/environment/$DIR/env env.$DIR && \

  echo '[SERVER]: Ensuring env vars are ready to go' && \
  stat -t env.$DIR && \

  echo 'Ensuring ssl files are ready to go' && \
  ([ -f ~/environment/$DIR/ssl/$SSL_KEY ] && echo 'SSL KEY FOUND' || echo 'SSL KEY NOT FOUND') && \
  ([ -f ~/environment/$DIR/ssl/$SSL_CERT ] && echo 'SSL CERTIFICATE FOUND' || echo 'SSL CERTIFICATE NOT FOUND') && \
  ([[ $SSL_CHALLENGE != 'false' ]] &&  stat -t ~/environment/$DIR/ssl/$SSL_CHALLENGE || echo 'SKIP SSL CHALLENGE CHECK') && \

  echo -n 'Building $NGINX_DOCKER_NAME image. This may take a while...' && \
  start=$SECONDS
  docker build $NO_CACHE_OPTION -f Dockerfile.nginx -t $NGINX_DOCKER_NAME . > /dev/null && \
  echo ' built in $(( SECONDS - start )) seconds' && \

  echo -n '[SERVER]: Building $GRAPHQL_DOCKER_NAME image. This may take even more....' && \
  start=$SECONDS && \
  ([[ $VERBOSE = 'true' ]] && docker build -f Dockerfile.apollo -t $GRAPHQL_DOCKER_NAME . || docker build -f Dockerfile.apollo -t $GRAPHQL_DOCKER_NAME . > /dev/null)  && \
  echo ' built in $(( SECONDS - start )) seconds' && \

  echo '[SERVER]: Stopping [$NGINX_DOCKER_NAME, $GRAPHQL_DOCKER_NAME] and removing their images' && \
  docker stop $NGINX_DOCKER_NAME ; \
  docker rm -f $NGINX_DOCKER_NAME ; \
  docker stop $GRAPHQL_DOCKER_NAME ; \
  docker rm -f $GRAPHQL_DOCKER_NAME ; \

  echo '[SERVER]: Starting all containers again.' && \
  docker run \
  --name $GRAPHQL_DOCKER_NAME \
  -d $DOCKER_NETWORK \
  --restart always \
  $DOCKER_SERVER_ENV \
  --env-file=env.$DIR \
  $GRAPHQL_DOCKER_NAME && \

  docker run \
  --name $NGINX_DOCKER_NAME \
  -d $DOCKER_NETWORK \
  $NGINX_MAPPED_PORTS \
  -v ~/environment/$DIR/ssl/:/etc/nginx/certs/:ro \
  --restart always \
  $NGINX_DOCKER_NAME && \

  echo '[SERVER]: DOCKER Cleaner Just STARTED. Wait till all is cleaned' && \
  bash superclean.sh > /dev/null && \
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
