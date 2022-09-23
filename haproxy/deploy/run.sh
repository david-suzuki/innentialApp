#!/bin/bash
################ INPUT VARS ##############
TARGET=$1
ENV=$6
##########################################

################ CONFIG VARS #############
shopt -s extglob
source ./deploy/config.sh
#########################################

############# CHECKING INPUT PARAMS #####

if [ -z "$TARGET" ]; then
  echo 'Missing mandatory deployment target'
  exit 0
fi

#########################################

case "$TARGET" in
  $DEPLOYMENT_TARGETS)
    if [ "$ENV" == "true" ]; then
        RUN_TARGET="./deploy/set_env-$TARGET.sh"
      else
        RUN_TARGET="./deploy/run-$TARGET.sh"
    fi
    shopt -u extglob
    source $RUN_TARGET        
    ;;
  *)
    for TARGETS in $DEPLOYMENT_TARGETS
      do
        VALUE="${TARGETS//|/, }"
        VALUE=${VALUE%?}
        VALUE="${VALUE:2}"
      done
    shopt -u extglob
    echo "Invalid deployment target. Possible values: $VALUE"
    exit 0
    ;;
esac
