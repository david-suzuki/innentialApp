#!/bin/bash
################ CONFIG VARS #############
DEPLOYMENT_TARGETS="@(staging-haproxy|production-haproxy)"

# Leave *_SSH_KEY empty if connecting to the remote sever with password

STAGING_SERVER_USER=root
STAGING_SERVER_HOST=139.59.154.39
STAGING_DEFAULT_SSH_KEY=~/.ssh/innential-staging
STAGING_APP_NAME=innential
STAGING_APP_DOMAIN=user-staging.innential.com
STAGING_ADMIN_DOMAIN=admin-staging.innential.com
STAGING_GRAPHQL_DOMAIN=api-staging.innential.com
STAGING_FORCE_SSL=false
STAGING_LABEL=staging


DEVELOPMENT_SERVER_USER=
DEVELOPMENT_SERVER_HOST=
DEVELOPMENT_DEFAULT_SSH_KEY=

PRODUCTION_SERVER_USER=root
PRODUCTION_SERVER_HOST=188.166.162.105
PRODUCTION_DEFAULT_SSH_KEY=~/.ssh/innential-production
PRODUCTION_APP_NAME=innential
PRODUCTION_APP_DOMAIN=app.innential.com
PRODUCTION_ADMIN_DOMAIN=admin.innential.com
PRODUCTION_GRAPHQL_DOMAIN=api.innential.com
PRODUCTION_FORCE_SSL=false
PRODUCTION_LABEL=production

DEPLOY_ID=$(date "+%H%M%S%d%m%y")
DEPLOY_DIR=deploy
PROXY_BUNDLE=bundle
TMP_DIR=/tmp
DOCKER_TOOLS=$DEPLOY_DIR/docker-tools
#########################################
