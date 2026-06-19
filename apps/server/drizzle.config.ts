import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/db/schema.ts',
	// Relative to this config (apps/server); drizzle-kit doubles an absolute path.
	// Runtime migration uses env.DB_MIGRATIONS_DIR, which resolves to the same dir.
	out: './db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: './data/app.sqlite',
	},
});
