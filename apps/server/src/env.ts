import { statSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

try {
	process.loadEnvFile();
} catch (error) {
	if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
		throw error;
	}
}

const optionalString = z.preprocess(
	(value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
	z.string().optional()
);

const existingDir = (envKey: string) =>
	z.string().superRefine((dirPath, ctx) => {
		try {
			const stat = statSync(dirPath);
			if (!stat.isDirectory()) {
				ctx.addIssue({
					code: 'custom',
					message: `${envKey} is not a directory: ${dirPath}`,
				});
			}
		} catch (error) {
			if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
				ctx.addIssue({
					code: 'custom',
					message: `${envKey} directory does not exist: ${dirPath}`,
				});
				return;
			}
			throw error;
		}
	});

const resolvedDir = (defaultRelativePath: string, envKey: string) =>
	optionalString
		.transform((value) => path.resolve(value ?? path.join(process.cwd(), defaultRelativePath)))
		.pipe(existingDir(envKey));

const optionalResolvedDir = (envKey: string) =>
	optionalString
		.transform((value) => (value ? path.resolve(value) : undefined))
		.pipe(z.union([z.undefined(), existingDir(envKey)]));

const envSchema = z.object({
	DATA_DIR: resolvedDir('data', 'DATA_DIR'),
	DB_MIGRATIONS_DIR: resolvedDir('db/migrations', 'DB_MIGRATIONS_DIR'),
	PORT: z.coerce.number().int().positive().default(3000),
	STATIC_DIR: optionalResolvedDir('STATIC_DIR'),
});

export const env = envSchema.parse(process.env);
