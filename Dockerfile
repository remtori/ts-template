# syntax=docker/dockerfile:1

FROM node:24-bookworm AS build

RUN corepack enable && corepack prepare pnpm@11.2.2 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client/package.json apps/client/
COPY apps/server/package.json apps/server/
COPY packages/tsconfig/package.json packages/tsconfig/

RUN pnpm install --frozen-lockfile

COPY packages/tsconfig packages/tsconfig
COPY apps/client apps/client
COPY apps/server apps/server

RUN pnpm build
RUN pnpm --filter @repo/server deploy --prod --legacy /out/server

FROM node:24-bookworm-slim AS run

RUN apt-get update \
	&& apt-get install -y --no-install-recommends gosu \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV STATIC_DIR=/app/static
ENV DATA_DIR=/app/data
ENV DB_MIGRATIONS_DIR=/app/db/migrations

COPY --chown=node:node --from=build /out/server/node_modules ./node_modules
COPY --chown=node:node --from=build /out/server/package.json ./package.json
COPY --chown=node:node --from=build /app/apps/server/dist ./dist
COPY --chown=node:node --from=build /app/apps/client/dist ./static
COPY --chown=node:node --from=build /app/apps/server/db/migrations ./db/migrations
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN mkdir -p /app/data && chown -R node:node /app \
	&& chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
VOLUME /app/data

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
