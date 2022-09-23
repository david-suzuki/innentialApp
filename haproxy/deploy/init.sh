TARGET=_
SSH_KEY=_
PASSW=_
NO_BUILD=_
HOST_STRING=_
ENV=_
VERBOSE=_

source ./deploy/config.sh
shopt -s extglob
while test $# -gt 0; do
        case "$1" in
                -h|--help)
                        echo "options:"
                        echo "-h, --help             shows brief help"
                        echo "-k, --key SSH_KEY      specifies a ssh key path to use. Ex: -k ~/.ssh/your-key.pem"
                        echo "-hs, --host-string     specifies which connection string to use. Ex: -hs ubuntu@188.246.36.110"
                        echo "-fp, --force-pwd       will force ssh connection to use only password authorization, if not disallowed by the remote server"
                        echo "-nb, --no-build        triggers the deploy without building the app first (it will use the build from the /tmp folder, if any)"
                        echo "-v, --verbose          shows the output stream during builds"
                        exit 0
                        ;;
                $DEPLOYMENT_TARGETS)
                        TARGET=$1
                        shift
                        ;;
                -k|--key)
                        shift
                        if test $# -gt 0; then
                                SSH_KEY=$1
                        else
                                echo "ERROR: no ssh key pah has been specified. Ex: ~/.ssh/your-key.pem"
                                exit 1
                        fi
                        shift
                        ;;
                -hs|--host-string)
                        shift
                        if test $# -gt 0; then
                                HOST_STRING=$1
                        else
                                echo "ERROR: no connection string has been specified."
                                exit 1
                        fi
                        shift
                        ;;
                -fp|--force-pwd)
                        shift
			PASSW="true"
                        ;;
                -v|--verbose)
                        shift
			VERBOSE="true"
                        ;;
                -nb|--no-build)
                        shift
			NO_BUILD="true"
                        ;;
                *)
                        break
                        ;;
        esac
done
#echo "$TARGET $SSH_KEY $PASSW $NO_BUILD $HOST_STRING $ENV $VERBOSE"
bash $(pwd)/deploy/run.sh $TARGET $SSH_KEY $PASSW $NO_BUILD $HOST_STRING $ENV $VERBOSE