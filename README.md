# TS Template

Node pnpm monorepo with React + Tailwind client and Hono + Drizzle server.

## Setup

```bash
corepack enable
corepack use pnpm@latest
pnpm install
```

## Configuration

The server runs with local defaults. To override ports or data paths, copy the server env template:

```bash
cp apps/server/.env.example apps/server/.env
```

Shell-exported vars take precedence over values in `apps/server/.env`.

## Development

```bash
pnpm dev
```

Runs the client (Vite) and server (Hono) concurrently. The client proxies `/api` to the server.

## Scripts

- `pnpm dev` — Run client and server concurrently
- `pnpm build` — Build all packages
- `pnpm check` — Type-check all packages with tsgo
- `pnpm test` — Run tests
- `pnpm lint` — Lint with oxlint
- `pnpm lint:fix` — Fix lint issues
- `pnpm format` — Format TS/CSS/MD with Biome
- `pnpm format:check` — Check formatting
- `pnpm db:generate` — Generate Drizzle migrations from schema changes

## Packages

- `@repo/client` — React + Tailwind + Vite
- `@repo/server` — Hono routes + Drizzle ORM (SQLite)
- `@repo/tsconfig` — Shared TypeScript configs
