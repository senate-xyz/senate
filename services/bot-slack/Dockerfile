FROM --platform=linux/amd64 node:16-alpine

# update packages
RUN apk update

WORKDIR /app

COPY /types ./types
COPY /prisma/schema.prisma ./prisma/schema.prisma

# create root application folder
WORKDIR /app/services/bot-slack

# copy configs to /app folder
COPY /services/bot-slack/package.json .
COPY /services/bot-slack/tsconfig.json .
# copy source code to /app/src folder
COPY /services/bot-slack/src ./src

RUN yarn
RUN npx prisma generate
RUN cp -R ./node_modules ../../types/
RUN yarn build

EXPOSE 3011

CMD [ "node", "./dist/services/bot-slack/src/app.js" ]