#!/usr/bin/env bash

bash docker-clean.sh rm-exited
bash docker-clean.sh rm-untagged
bash docker-clean.sh rm-dangling
bash docker-clean.sh rm-volumes

