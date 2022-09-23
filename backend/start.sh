#!/bin/bash

############# change these settings ###################
DEFAULT_SECRET_TOKEN_VALUE=cAsxjaHUtud9k2w4 # for development only
DEFAULT_SECRET_REFRESH_TOKEN_VALUE=cAsxjaHUtud9k2w4 # for development only
DB_PASSWORD=1234 # for development only
DB_HOST=localhost
#######################################################

# all secret stuff and needed ENVs goes here before starting the server
AUTH_SECRET_TOKEN="${DEFAULT_SECRET_TOKEN_VALUE}"

AUTH_SECRET_REFRESH_TOKEN="${DEFAULT_SECRET_REFRESH_TOKEN_VALUE}"

export AUTH_SECRET_TOKEN
export AUTH_SECRET_REFRESH_TOKEN
export DB_PASSWORD
export DB_HOST
export MONGO_URL=mongodb://localhost
export AUTH_ENDPOINT=localhost
export NODE_ENV_TARGET=development

npm run launch
