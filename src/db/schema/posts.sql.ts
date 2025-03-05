import { relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { maxLengthUsername } from '@/utils/consts';
import { timestamps } from '@/db/schema/timestamps.helpers';
import { users } from '@/db/schema/users.sql';

export const posts = pgTable('posts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({length: 256}).notNull(),
  body: text().notNull(),
  authorId: varchar().notNull(),
  ...timestamps
})

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
}));

export type SelectPost = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;