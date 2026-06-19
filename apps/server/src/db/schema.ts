import { mkdirSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { env } from '#/env';

mkdirSync(env.DATA_DIR, { recursive: true });

export const appEventsTable = sqliteTable('app_events', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	type: text('type').notNull(),
	payloadJson: text('payload_json').notNull().default('{}'),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

const sqlite = new Database(path.join(env.DATA_DIR, 'app.sqlite'));

export const db = drizzle(sqlite, { schema: { appEventsTable } });

export function runDbMigration(): void {
	mkdirSync(env.DB_MIGRATIONS_DIR, { recursive: true });
	migrate(db, { migrationsFolder: env.DB_MIGRATIONS_DIR });
}
