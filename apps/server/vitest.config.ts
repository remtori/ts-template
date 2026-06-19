import { mkdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

const vitestDataDir = fileURLToPath(new URL('.vitest-data', import.meta.url));
mkdirSync(vitestDataDir, { recursive: true });

export default defineConfig({
	resolve: {
		alias: {
			'#': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	test: {
		include: ['src/**/*.test.ts'],
		passWithNoTests: true,
		fileParallelism: false,
		env: {
			DATA_DIR: vitestDataDir,
		},
	},
});
