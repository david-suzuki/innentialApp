source ./deploy/config/common.sh

########## SERVER CREDENTIALS ######################
SERVER_USER=root
SERVER_HOST=139.59.154.39
DEFAULT_SSH_KEY=~/.ssh/innential-staging #TODO: update this

######### APP NAME AND DOMAIN #############
APP_NAME=innential
APP_DOMAIN=user-staging.innential.com

########## NGINX ###################################
NGINX_DOCKER_NAME=$APP_NAME.app.nginx

NGINX_DOCKER_VERSION=1.19.0 #or latest

NGINX_CONF_FILE=nginx.conf.erb

NGINX_BASIC_AUTH_ENABLED=true
NGINX_AUTH_USER=1
NGINX_AUTH_PASSWORD=1

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
NGINX_USE_PRERENDER=false

########## HAPROXY #########################
HAPROXY_PROTOCOL=true

########## GRAPHQL #########################
GRAPHQL_SERVER_PORT=3000
GRAPHQL_SERVER_HOST=$APP_NAME.graphql
GRAPHQL_SERVER_PROTOCOL=http

########## LABEL #########################
LABEL=staging

#########################################
