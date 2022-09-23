#!/usr/bin/env bash

#
# Docker Cleanup / Update Script
#
# Usage Example:
# curl --silent https://gist.githubusercontent.com/macropin/3d06cd315a07c9d8530f/raw | bash -s rm-dangling
#

set -e

[ "$DEBUG" == 'true' ] && set -x

function self_update {
    echo "==> Updating $(basename $0)"
    SCRIPT="$(dirname $0)/$(basename $0)"
    curl --silent https://gist.githubusercontent.com/macropin/3d06cd315a07c9d8530f/raw > ${SCRIPT}.tmp
    exec bash -c "mv ${SCRIPT}.tmp ${SCRIPT} && chmod +x ${SCRIPT}"
}

function update_images {
    echo "==> Updating Images"
    IMAGES=$(docker images | tail -n +2 | awk '{ print $1 ":" $2 }' | sort)
    for I in $IMAGES; do
        [ ! "$I" == "<none>:<none>" ] && docker pull $I || echo "Skipping untagged image"
    done
}

function rm_dangling {
    echo "==> Deleting Dangling Images"
    IMAGES=$(docker images -q --filter dangling=true)
    test "$IMAGES" && (echo $IMAGES | xargs -n 1 docker rmi) || true
}

function rm_untagged {
    echo "==> Deleting Untagged Images"
    IMAGES=$(docker images | grep '<none>' | awk '{ print $3 }')
    test "$IMAGES" && (echo $IMAGES | xargs -n 1 docker rmi) || true
}

function rm_exited {
    echo "==> Deleting Stopped Containers"
    CONTAINERS=$(docker ps -q --filter status=exited --filter status=created --filter status=dead)
    test "$CONTAINERS" && (echo $CONTAINERS | xargs -n 1 docker rm -f ) || true
}

function rm_volumes {
    echo "==> Deleting Danging Volumes"
    VOLUMES=$(docker volume ls -qf dangling=true)
    test "$VOLUMES" && (echo $VOLUMES | xargs -n 1 docker volume rm) || true
}

function rm_versioned {
    echo "==> Deleting Versioned Images"
    IMAGE="$1"
    KEEP=${2:-4}

    [ "$KEEP" -eq "$KEEP" ] || (echo "Error KEEP isnt a number" && exit 128)
    [ "$IMAGE" == "" ] && echo "Usage: $0 <image> <keep>" && exit 1

    # skip first line, show full image name, sort, then grab $KEEP number
    IMAGES=$(docker images "$IMAGE" | tail -n+2 | awk '{ print $1 ":" $2 }' | sort --version-sort --reverse | tail -n+$((1 + $KEEP)))

    for I in $IMAGES; do
       docker rmi $I 1> /dev/null
    done
}

function show_usage {
    echo "
Docker Maintenance

  usage: docker-maintenance.sh [ <option> ...]

  options:
    self-update                  Update this script
    update                       Update all docker image
    rm-exited                    Delete exited containers
    rm-untagged                  Delete all untagged images
    rm-dangling                  Delete dangling images
    rm-volumes                   Delete all dangling (unused) volumes
    rm-versioned <image> <keep>  elete Docker Images by version tag. Keep X number of images
    restart                      Restart Docker
    -h | --help                  Show this usage
    ";
}

# Parse Opts
[ "$1" == "" ] && show_usage && exit
while true; do
    case "$1" in
        self-update ) self_update; shift ;;
        update ) update_images; shift ;;
        rm-exited ) rm_exited; shift ;;
        rm-untagged ) rm_untagged; shift ;;
        rm-dangling ) rm_dangling; shift ;;
        rm-volumes ) rm_volumes; shift ;;
        rm-versioned ) shift; rm_versioned $1 $2; shift 2; ;;
        restart ) systemctl restart docker.service; shift ;;
        -h | --help ) show_usage; break ;;
        -- ) shift; break ;;
        * ) [ ! "$1" == "" ] && echo "Unknown argument"; break ;;
    esac
done
