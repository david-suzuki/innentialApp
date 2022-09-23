#!/bin/bash
################ INPUT VARS ##############
TARGET=$1
SSH_KEY=$2
PASSW=$3
NO_BUILD=$4
HOST_STRING=$5
ENV=$6
VERBOSE=$7
SSL=$8
NO_CACHE=$9
##########################################

################ CONFIG VARS #############
shopt -s extglob
source ./deploy/config/targets.sh
#########################################

############# CHECKING INPUT PARAMS #####

if [ -z "$TARGET" ]; then
  echo 'Missing mandatory deployment target'
  exit 0
fi

#########################################
# echo $TARGET $ENV $SSL
case "$TARGET" in
  $DEPLOYMENT_TARGETS)
    # if [ "$SSL" == "true" ]; then
    #     RUN_TARGET="./deploy/set_ssl-$TARGET.sh"
    # elif [ "$ENV" == "true" ]; then
    #     RUN_TARGET="./deploy/set_env-$TARGET.sh"
    #   else
    #     RUN_TARGET="./deploy/run-$TARGET.sh"
    # fi
    arrTARGET=(${TARGET//-/ })
    if [ "$SSL" == "true" ]; then
        RUN_TARGET="./deploy/set_ssl-${arrTARGET[1]}.sh ${arrTARGET[0]} $SSH_KEY $PASSW $NO_BUILD $HOST_STRING"
    elif [ "$ENV" == "true" ]; then
        RUN_TARGET="./deploy/set_env-${arrTARGET[1]}.sh ${arrTARGET[0]} $SSH_KEY $PASSW $NO_BUILD $HOST_STRING"
      else
        RUN_TARGET="./deploy/run-${arrTARGET[1]}.sh ${arrTARGET[0]} $SSH_KEY $PASSW $NO_BUILD $HOST_STRING $NO_CACHE $VERBOSE"
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
