#!/bin/bash

set -e

APP_NAME=jshm
REGION=us-west-2
PROJ_TAG=jshm
APP_TAG=jshm
PROFILE=deployer-user
S3_SOURCE_BUNDLE_BUCKET=deployer-storage
S3_SOURCE_BUNDLE_FOLDER=cloudformation/jshm
TEMPLATE=./template.json
OUTPUT_TEMPLATE=$TMPDIR/jshm-output-template.yml

main() {
  initialize "$@"
  validate_template
  package_template
  deploy_template
  exit 0
}

function display_usage {
  echo "usage: stack.sh <dev|staging|prod> [env-name] [--no-execute]"
  echo "   ex: stack.sh dev"
  echo "   ex: stack.sh dev jshm-dev"
  echo "   ex: stack.sh dev jshm-dev --no-execute"
  exit 1
}

function initialize {
  STACK=$1
  if [[ "$STACK" != "dev" && "$STACK" != "staging" && "$STACK" != "prod" ]]; then
    display_usage
  fi

  if [[ "$2" != "" ]]; then
    ENV_NAME=$2
  else
    ENV_NAME=$APP_NAME-${STACK}
  fi
  NO_EXECUTE_OPTION=""
  if [[ "$3" == "--no-execute" ]]; then
    NO_EXECUTE_OPTION="--no-execute-changeset"
  fi
}

function validate_template {
  echo "Validating Cloudformation Template"
  aws cloudformation validate-template --template-body file://${TEMPLATE}
}

function package_template {
  S3_PREFIX=${S3_SOURCE_BUNDLE_FOLDER}/${STACK}
  echo "Packaging Cloudformation Remplate and Storing in S3 Bucket at '${S3_SOURCE_BUNDLE_BUCKET}/${S3_PREFIX}'"

  aws --region $REGION cloudformation package \
    --template $TEMPLATE \
    --s3-bucket $S3_SOURCE_BUNDLE_BUCKET \
    --s3-prefix $S3_PREFIX \
    --output-template-file $OUTPUT_TEMPLATE
}

function deploy_template {
  aws --region $REGION cloudformation deploy \
    --stack-name $ENV_NAME \
    --capabilities=CAPABILITY_NAMED_IAM \
    --template-file $OUTPUT_TEMPLATE \
    --profile $PROFILE \
    $NO_EXECUTE_OPTION \
    --parameter-overrides \
    Stack=$STACK
}

main "$@"
