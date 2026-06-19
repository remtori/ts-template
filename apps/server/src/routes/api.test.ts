import { beforeAll, describe, expect, it } from 'vitest';

import { runDbMigration } from '#/db/schema';
import { routes } from './index';

beforeAll(() => {
	runDbMigration();
});

describe('routes', () => {
	it('serves health', async () => {
		const response = await routes.request('/health');
		const body = (await response.json()) as { status: string; service: string; timestamp: string };

		expect(response.status).toBe(200);
		expect(body.status).toBe('ok');
		expect(body.service).toBe('ts-template');
		expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');
	});

	it('serves stats', async () => {
		const response = await routes.request('/stats');
		const body = (await response.json()) as { eventCount: number };

		expect(response.status).toBe(200);
		expect(body.eventCount).toBeGreaterThanOrEqual(0);
	});
});
