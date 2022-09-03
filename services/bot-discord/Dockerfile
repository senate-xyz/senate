FROM node:16-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY /services/bot-discord/package*.json ./
COPY /yarn.lock ./
COPY /services/bot-discord/tsconfig.json ./
# copy source code to /app/src folder
COPY /services/bot-discord/src /app/src

RUN yarn
RUN yarn build

EXPOSE 3010

CMD [ "node", "./dist/app.js" ]