import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
import { DATABASE_URL } from '@/config/env';

const client = new SQL(DATABASE_URL)
export const db = drizzle({ client, casing: 'snake_case' })