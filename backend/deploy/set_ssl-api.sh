#!/bin/bash
################ INPUT VARS ##############
TARGET=$1
SSH_KEY=$2
PASSW=$3
NO_BUILD=$4
HOST_STRING=$5
##########################################

################ CONFIG VARS #############
source ./deploy/config/$TARGET.sh
#########################################

############## LOCAL VARS #############
SSH_CONN=$SERVER_USER@$SERVER_HOST
ENV_PATH=$SSL_PATH
#########################################

MAKE_FOLDERS="\
  cd ~/ && \
  mkdir -p environment/$DIR/ssl \
  "
  ### CONDITIONAL CONNECTION_STRING
if [ "$HOST_STRING" != "_" ]; then
    SSH_CONN=$HOST_STRING
fi
echo '[INFO]: Connecting to: ' $SSH_CONN

## CONDITIONAL SSH
if [ "$PASSW" == "_" ]; then
  CUSTOM_SSH_KEY=
  if [ "$SSH_KEY" != "_" ]; then
    CUSTOM_SSH_KEY=true
  fi
  if [ "$CUSTOM_SSH_KEY" == "true" ]; then
    echo '[INFO]:  Using custom key path: ' $SSH_KEY
    ssh -i $SSH_KEY -o 'IdentitiesOnly yes' $SSH_CONN $MAKE_FOLDERS
  elif [ "$SSH_KEY" == "_" ]; then
     if [ "$DEFAULT_SSH_KEY" != "" ]; then
           echo '[INFO]: Using default key path: ' $DEFAULT_SSH_KEY
           ssh -i $DEFAULT_SSH_KEY -o 'IdentitiesOnly yes' $SSH_CONN $MAKE_FOLDERS
         else
           echo '[INFO]: Using password authentication connecting to the server'
           ssh -o PubkeyAuthentication=no $SSH_CONN $MAKE_FOLDERS
     fi
  fi
  else
    echo '[INFO]: Using password authentication connecting to the server'
    ssh -o PubkeyAuthentication=no $SSH_CONN $MAKE_FOLDERS
fi
### CONDITIONAL SCP
echo "[INFO]: Copying $ENV_PATH to $TARGET server in ~/environment/$DIR/ssl"
if [ "$PASSW" == "_" ]; then
  CUSTOM_SSH_KEY=
  if [ "$SSH_KEY" != "_" ]; then
    CUSTOM_SSH_KEY=true
  fi
  if [ "$CUSTOM_SSH_KEY" == "true" ]; then
    echo '[INFO]: Using custom key path: ' $SSH_KEY
    scp -rp -i $SSH_KEY -o 'IdentitiesOnly yes' $ENV_PATH/* $SSH_CONN:~/environment/$DIR/ssl
  elif [ "$SSH_KEY" == "_" ]; then
    if [ "$DEFAULT_SSH_KEY" != "" ]; then
      echo '[INFO]: Using default key path: ' $DEFAULT_SSH_KEY
      scp -rp -i $DEFAULT_SSH_KEY -o 'IdentitiesOnly yes' $ENV_PATH/* $SSH_CONN:~/environment/$DIR/ssl
      else
      echo '[INFO]: Forcing password authentication connecting to the server'
      scp -rp -o PubkeyAuthentication=no $ENV_PATH/* $SSH_CONN:~/environment/$DIR/ssl
    fi
  fi
  else
    echo '[INFO]: Forcing password authentication connecting to the server'
    scp -rp -o PubkeyAuthentication=no $ENV_PATH/* $SSH_CONN:~/environment/$DIR/ssl
fi
