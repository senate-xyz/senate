# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY ./web-nextapp/package.json . 
COPY ./yarn.lock .
COPY ./web-nextapp/prisma/schema.prisma ./prisma/schema.prisma

RUN yarn
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate

#######################################################
#######################################################
#######################################################

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY ./web-nextapp .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma


# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

ENV DATABASE_URL="file:./dev.db"
RUN yarn build

#######################################################
#######################################################
#######################################################

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV DATABASE_URL="file:./dev.db"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]