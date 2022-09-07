FROM --platform=linux/amd64 node:16-alpine

# update packages
RUN apk update

WORKDIR /app

COPY /types ./types
COPY /prisma/schema.prisma ./prisma/schema.prisma

# create root application folder
WORKDIR /app/services/proposal-detective

# copy configs to /app folder
COPY /services/proposal-detective/package.json .
COPY /services/proposal-detective/tsconfig.json .
# copy source code to /app/src folder
COPY /services/proposal-detective/src ./src

RUN yarn
RUN npx prisma generate
RUN cp -R ./node_modules ../../types/
RUN yarn build

EXPOSE 3001

CMD [ "node", "./dist/services/proposal-detective/src/app.js" ]