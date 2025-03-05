import { maxLengthUsername } from '@/utils/consts';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from '@/db/schema/timestamps.helpers';
import { relations } from 'drizzle-orm';
import { posts } from '@/db/schema/posts.sql';

export const users = pgTable('users', {
  id: uuid('id').$defaultFn(() => Bun.randomUUIDv7()).primaryKey(),
  email: varchar().notNull().unique(),
  username: varchar({ length: maxLengthUsername }).notNull().unique(),
  password: varchar().notNull(),
  ...timestamps
})

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;