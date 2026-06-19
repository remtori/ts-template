import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	alias: {
		'#': './src',
	},
	format: ['esm'],
	target: 'node24',
	platform: 'node',
	outDir: 'dist',
	clean: true,
	dts: false,
	sourcemap: true,
	splitting: false,
});
