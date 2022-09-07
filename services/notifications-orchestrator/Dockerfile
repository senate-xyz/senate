FROM --platform=linux/amd64 node:16-alpine

# update packages
RUN apk update

WORKDIR /app

COPY /types ./types
COPY /prisma/schema.prisma ./prisma/schema.prisma

# create root application folder
WORKDIR /app/services/notifications-orchestrator

# copy configs to /app folder
COPY /services/notifications-orchestrator/package.json .
COPY /services/notifications-orchestrator/tsconfig.json .
# copy source code to /app/src folder
COPY /services/notifications-orchestrator/src ./src

RUN yarn
RUN npx prisma generate
RUN cp -R ./node_modules ../../types/
RUN yarn build

EXPOSE 3002

CMD [ "node", "./dist/services/notifications-orchestrator/src/app.js" ]