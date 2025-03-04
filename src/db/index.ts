import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from '@/config/env'

const client = new SQL({
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: Number(DB_PORT),
  user: DB_USER,
  ssl: false
})
export const db = drizzle({ client })