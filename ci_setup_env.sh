#!/bin/bash

if [ "${CIRCLE_BRANCH}" == "dev" ]
then
  echo "export DATABASE_URL=${DEVELOPMENT_DB}" > ./ci_env.sh
elif [ "${CIRCLE_BRANCH}" == "staging" ]
then
  echo "export DATABASE_URL=${STAGING_DB}" > ./ci_env.sh
elif [ "${CIRCLE_BRANCH}" == "main" ]
then
  echo "export DATABASE_URL=${PRODUCTION_DB}" > ./ci_env.sh
fi

chmod +x ./ci_env.sh

echo "DATABASE_URL set for : ${CIRCLE_BRANCH} to ${DATABASE_URL}"

exit 0