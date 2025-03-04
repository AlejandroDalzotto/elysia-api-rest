import { maxLengthUsername } from '@/lib/consts';
import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from '@/db/schema/timestamps.helpers';

export const users = pgTable('users', {
  id: varchar().$defaultFn(() => Bun.randomUUIDv7()).primaryKey(),
  email: varchar().notNull().unique(),
  username: varchar({ length: maxLengthUsername }).notNull().unique(),
  password: varchar().notNull(),
  ...timestamps
})

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;