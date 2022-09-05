FROM node:16-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY /services/proposal-detective/package*.json ./
COPY /yarn.lock ./
COPY /services/proposal-detective/tsconfig.json ./
# copy source code to /app/src folder
COPY /services/proposal-detective/src /app/src

RUN yarn
RUN yarn build

EXPOSE 3001

CMD [ "node", "./dist/app.js" ]