FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /app/package.json ./
COPY --from=builder --chown=hono:nodejs /app/dist ./dist

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]