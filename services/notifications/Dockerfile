FROM node:16-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY /services/notifications/package*.json ./
COPY /yarn.lock ./
COPY /services/notifications/tsconfig.json ./
# copy source code to /app/src folder
COPY /services/notifications/src /app/src

# check files list
RUN ls -a

RUN yarn
RUN yarn build

EXPOSE 3001

CMD [ "node", "./dist/app.js" ]