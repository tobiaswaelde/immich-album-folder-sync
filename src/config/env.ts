import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { bool, cleanEnv, num, str } from 'envalid';

// load .env file
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

/**
 * Application environment variables
 */
export const ENV = cleanEnv(process.env, {
  PORT: num({ default: 3001 }),
  IMMICH_API_URL: str({ desc: 'Base URl to your Immich server' }),
  IMMICH_API_KEY: str({
    desc: 'Learn how to get your API key at https://immich.app/docs/features/command-line-interface#obtain-the-api-key',
  }),
  SYNC_CRON: str({ default: '0 * * * *', desc: 'Cron expression to sync' }),
  SYNC_ON_START: bool({ default: true, desc: 'If `true`, run sync on application startup' }),
});

// log environment variables to console (dev only)
if (ENV.isDev) {
  console.log('Environment variables loaded');
  for (const [key, value] of Object.entries(ENV)) {
    console.debug(`${key}: ${value}`);
  }
}
