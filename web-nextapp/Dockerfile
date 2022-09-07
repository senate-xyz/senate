# Install dependencies only when needed
FROM --platform=linux/amd64 node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./prisma/schema.prisma ./prisma/schema.prisma

WORKDIR /app/webapp
# Install dependencies based on the preferred package manager
COPY ./web-nextapp/package.json . 

RUN yarn
RUN npx prisma generate

#######################################################
#######################################################
#######################################################

# Rebuild the source code only when needed
FROM --platform=linux/amd64 node:alpine AS builder
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app
COPY --from=deps /app/webapp/node_modules ./node_modules
COPY ./types ./types

WORKDIR /app/webapp
COPY ./web-nextapp .
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/webapp/node_modules ./node_modules

WORKDIR /app/webapp
RUN yarn build

#######################################################
#######################################################
#######################################################

# Production image, copy all the files and run next
FROM --platform=linux/amd64 node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/webapp/public ./public
COPY --from=builder /app/webapp/prisma ./prisma
COPY --from=builder /app/webapp/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/webapp/.next ./.next

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]