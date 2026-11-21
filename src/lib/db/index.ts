import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL is not set in environment variables');
}

// Em pooler de transação (Supabase porta 6543), prepared statements devem ser desativados
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
export type DB = typeof db;
