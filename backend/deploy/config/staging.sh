#!/bin/bash
source ./deploy/config/common.sh
########## SERVER CREDENTIALS ######################
SERVER_USER=root
SERVER_HOST=139.59.154.39
DEFAULT_SSH_KEY=~/.ssh/innential-staging

############# NODE #############
NODE_DOCKER_VERSION=erbium

######### APP NAME AND DOMAIN #############
APP_NAME=innential
GRAPHQL_DOMAIN=api-staging.innential.com

########## NGINX ###################################
NGINX_DOCKER_NAME=$APP_NAME.graphql.nginx

NGINX_DOCKER_VERSION=1.19.0 #or latest

NGINX_CONF_FILE=nginx.conf.erb

NGINX_FORCE_SSL=true
NGINX_USE_SSL=true
NGINX_EXPOSE=false
NGINX_EXPOSED_PORT=80 #mandatory, but will be applied only if NGINX_EXPOSE=true
NGINX_EXPOSED_SSL_PORT=443 #mandatory, but will be applied only if NGINX_EXPOSE=true && NGINX_USE_SSL=true
SSL_CHALLENGE=false
SSL_CERT=cert.crt
SSL_KEY=cert.key
SSL_PATH="$(pwd)"/$DEPLOY_DIR/ssl/staging

NGINX_USE_GZIP=true

GRAPHQL_DOCKER_PORT=3000

########## ENV ############################
ENV_PATH=env/.env.staging
LOOKENV_PATH="env/lookenv.stag.js"

########## HAPROXY #########################
HAPROXY_PROTOCOL=false


########## COMMANDS AND LABEL #######################
START_COMMAND=serve-staging
LABEL=staging

#########################################
