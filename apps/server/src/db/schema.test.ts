import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { appEventsTable, db, runDbMigration } from './schema';

beforeAll(() => {
	runDbMigration();
});

afterEach(() => {
	db.delete(appEventsTable).run();
});

describe('appEventsTable', () => {
	it('stores application events', () => {
		db.insert(appEventsTable).values({ type: 'template.ready' }).run();

		const events = db.select().from(appEventsTable).all();
		expect(events).toHaveLength(1);
		expect(events[0]?.type).toBe('template.ready');
	});
});
