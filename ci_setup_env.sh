#!/bin/bash

if [ "${CIRCLE_BRANCH}" == "dev" ]
then
  export DATABASE_URL=${DEVELOPMENT_DB}
elif [ "${CIRCLE_BRANCH}" == "staging" ]
then
  export DATABASE_URL=${STAGING_DB}
elif [ "${CIRCLE_BRANCH}" == "main" ]
then
  export DATABASE_URL=${PRODUCTION_DB}
fi

echo "DATABASE_URL set for : ${CIRCLE_BRANCH} to ${DATABASE_URL}"

exit 0