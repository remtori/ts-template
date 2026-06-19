import { afterEach, describe, expect, it, vi } from 'vitest';

import { getHealth } from './api';

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('getHealth', () => {
	it('returns the health payload', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(JSON.stringify({ status: 'ok', service: 'test', timestamp: '2026-01-01T00:00:00.000Z' })))
		);

		await expect(getHealth()).resolves.toEqual({
			status: 'ok',
			service: 'test',
			timestamp: '2026-01-01T00:00:00.000Z',
		});
	});

	it('throws on non-2xx responses', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response('nope', { status: 500 }))
		);

		await expect(getHealth()).rejects.toThrow('API request failed with 500');
	});
});
