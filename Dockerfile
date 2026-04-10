ARG BASE_IMAGE=mirror.gcr.io/library/node:20-alpine
FROM ${BASE_IMAGE} AS base

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN cp .env .env.runtime 2>/dev/null || cp .env.production .env.runtime 2>/dev/null || touch .env.runtime

RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.env.runtime ./.env

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3000/',(r)=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
