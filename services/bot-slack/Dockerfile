FROM node:16-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY /services/bot-slack/package*.json ./
COPY /yarn.lock ./
COPY /services/bot-slack/tsconfig.json ./
# copy source code to /app/src folder
COPY /services/bot-slack/src /app/src

RUN yarn
RUN yarn build

EXPOSE 3011

CMD [ "node", "./dist/app.js" ]