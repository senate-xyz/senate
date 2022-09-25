FROM --platform=linux/amd64 node:16-alpine

# update packages
RUN apk update

WORKDIR /app

COPY /types ./types
COPY /prisma/schema.prisma ./prisma/schema.prisma

# create root application folder
WORKDIR /app/services/epns

# copy configs to /app folder
COPY /services/epns/package.json .
COPY /services/epns/tsconfig.json .
# copy source code to /app/src folder
COPY /services/epns/src ./src

RUN yarn
RUN npx prisma generate
RUN cp -R ./node_modules ../../types/
RUN yarn build

EXPOSE 3002

CMD [ "node", "./dist/services/epns/src/app.js" ]