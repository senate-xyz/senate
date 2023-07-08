#!/bin/bash

if [ "${CIRCLE_BRANCH}" == "dev" ]
then
  export DATABASE_URL=${DEVELOPMENT_DB}
  npm run build
elif [ "${CIRCLE_BRANCH}" == "staging" ]
then
  export DATABASE_URL=${STAGING_DB}
  npm run build
elif [ "${CIRCLE_BRANCH}" == "main" ]
then
  export DATABASE_URL=${PRODUCTION_DB}
  npm run build
fi

echo "DATABASE_URL set for : ${CIRCLE_BRANCH}"

exit 0