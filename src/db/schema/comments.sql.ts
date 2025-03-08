import { relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { posts } from '@/db/schema/posts.sql';
import { timestamps } from '@/db/schema/timestamps.helpers';
import { users } from '@/db/schema/users.sql';


export const comments = pgTable('comments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  body: text('body'),
  authorId: varchar('author_id').notNull(),
  postId: integer('post_id'),
  ...timestamps
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id]
  })
}));