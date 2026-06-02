# Dependencias: instalar en el host (WSL/Linux) antes del build de imagen.
#   pnpm install --frozen-lockfile
# Luego:
#   docker compose build
ARG BASE_IMAGE=mirror.gcr.io/library/node:20-bookworm-slim
FROM ${BASE_IMAGE} AS base

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY node_modules ./node_modules

RUN test -d node_modules/next \
    || (echo "Falta node_modules. En el host ejecuta: pnpm install --frozen-lockfile" && exit 1)

COPY . .

RUN cp .env .env.runtime 2>/dev/null || cp .env.production .env.runtime 2>/dev/null || touch .env.runtime

RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

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
