import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';

import { runDbMigration } from './db/schema';
import { env } from './env';
import { API_PREFIX, routes } from './routes/index';

const app = new Hono();

runDbMigration();

app.route(API_PREFIX, routes);

if (env.STATIC_DIR) {
	app.use(
		'/*',
		serveStatic({
			root: env.STATIC_DIR,
			rewriteRequestPath: (requestPath) => {
				const pathname = requestPath.split('?')[0] ?? requestPath;
				const lastSegment = pathname.split('/').at(-1) ?? '';
				return lastSegment.includes('.') ? requestPath : '/index.html';
			},
		})
	);
}

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
	console.log(`Server listening on port ${info.port}`);
});
