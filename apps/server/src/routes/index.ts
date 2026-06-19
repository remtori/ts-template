import { sql } from 'drizzle-orm';
import { Hono } from 'hono';

import { appEventsTable, db } from '#/db/schema';

export const API_PREFIX = '/api';

export const routes = new Hono();

routes.get('/health', (c) =>
	c.json({
		status: 'ok',
		service: 'ts-template',
		timestamp: new Date().toISOString(),
	})
);

routes.get('/stats', (c) => {
	const row = db.select({ eventCount: sql<number>`count(*)` }).from(appEventsTable).get();
	return c.json({ eventCount: Number(row?.eventCount ?? 0) });
});
