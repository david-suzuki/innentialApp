########## PATHS #########################
DEPLOY_ID=$(date "+%H%M%S%d%m%y")
DEPLOY_DIR=deploy
NGINX_DIR=nginx
DIR=admin
DIST_DIR=build
BUNDLE=admin
PROXY_BUNDLE=bundle
TMP_DIR=/tmp
DOCKER_TOOLS=$DEPLOY_DIR/docker-tools
NGINX_CONF_FILE=nginx.conf.erb
NGINX_CONF_PATH="$(pwd)/$DEPLOY_DIR/$NGINX_DIR/$NGINX_CONF_FILE"
