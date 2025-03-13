import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema/users.sql';
import { comments } from '@/db/schema/comments.sql';
import { relations } from 'drizzle-orm';

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').notNull(),
  commentId: integer('comment_id').notNull(),
});

export const likesRelations = relations(likes, ({ one }) => ({
  comment: one(comments, {
    fields: [likes.commentId],
    references: [comments.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id]
  })
}));