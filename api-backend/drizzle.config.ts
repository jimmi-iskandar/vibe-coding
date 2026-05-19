import { defineConfig } from 'drizzle-kit';

const host = process.env.DATABASE_HOST || 'localhost';
const port = process.env.DATABASE_PORT || '3306';
const user = process.env.DATABASE_USER || 'root';
const password = process.env.DATABASE_PASSWORD || '';
const database = process.env.DATABASE_NAME || 'vibe_coding';

const connectionString = password 
  ? `mysql://${user}:${password}@${host}:${port}/${database}`
  : `mysql://${user}@${host}:${port}/${database}`;

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: connectionString,
  },
});
