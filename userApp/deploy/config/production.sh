source ./deploy/config/common.sh

########## SERVER CREDENTIALS ######################
SERVER_USER=root
SERVER_HOST=188.166.162.105
DEFAULT_SSH_KEY=~/.ssh/innential-production

#########W APP NAME AND DOMAIN #############
APP_NAME=innential
APP_DOMAIN=app.innential.com

########## NGINX ###################################
NGINX_DOCKER_NAME=$APP_NAME.app.nginx

NGINX_DOCKER_VERSION=1.19.0 #or latest
NGINX_CONF_FILE=nginx.conf.erb

NGINX_BASIC_AUTH_ENABLED=false
NGINX_AUTH_USER=temp
NGINX_AUTH_PASSWORD=temp

NGINX_FORCE_SSL=true
NGINX_USE_SSL=true
NGINX_EXPOSE=false
NGINX_EXPOSED_PORT=80 #mandatory, but will be applied only if NGINX_EXPOSE=true
NGINX_EXPOSED_SSL_PORT=443 #mandatory, but will be applied only if NGINX_EXPOSE=true && NGINX_USE_SSL=true
SSL_CHALLENGE=false
SSL_CERT=cert.crt
SSL_KEY=cert.key
SSL_PATH="$(pwd)"/$DEPLOY_DIR/ssl/production

NGINX_USE_GZIP=true
NGINX_USE_PRERENDER=false

########## HAPROXY #########################
HAPROXY_PROTOCOL=true

########## GRAPHQL #########################
GRAPHQL_SERVER_PORT=3000
GRAPHQL_SERVER_HOST=$APP_NAME.graphql
GRAPHQL_SERVER_PROTOCOL=http

########## LABEL #######################
LABEL=production

#########################################
