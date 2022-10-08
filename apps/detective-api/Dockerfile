FROM node:16-slim AS builder
RUN apt update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
# Only Take packages that are needed to compile this app
RUN turbo prune --scope=@senate/detective-api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:16-slim AS installer
RUN apt update
RUN apt-get install -y openssl git
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
RUN yarn install --frozen-lockfile

FROM node:16-slim AS sourcer
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN apt update
RUN apt-get install -y openssl
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
RUN yarn generate
RUN yarn turbo run build --scope=@senate/detective-api --include-dependencies --no-deps

FROM --platform=linux/amd64 node:16-slim as runner
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN apt update
RUN apt-get install -y openssl
WORKDIR /app
COPY --from=sourcer /app/ .
WORKDIR /app/apps/web/
COPY apps/detective-api/startup.sh .
RUN chmod +x startup.sh
CMD ["/bin/bash","-c","./startup.sh"]