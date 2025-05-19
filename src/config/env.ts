import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { cleanEnv, num, str } from 'envalid';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export const ENV = cleanEnv(process.env, {
	NODE_ENV: str({ default: 'development' }),
	LOG_LEVEL: str({ default: 'info', devDefault: 'debug' }),
	SYNC_INTERVAL: num({ default: 1000 * 60 * 60 }), // 1 hour
	IMMICH_API_URL: str({}),
	IMMICH_API_KEY: str({}),
});

if (ENV.isDev) {
	console.log('Environment variables loaded');
	for (const [key, value] of Object.entries(ENV)) {
		console.debug(`${key}: ${value}`);
	}
}
