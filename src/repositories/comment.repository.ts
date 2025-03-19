import { db } from '@/db';
import { comments } from '@/db/schema/comments.sql';
import { likes } from '@/db/schema/likes.sql';
import { MAX_ITEMS_PER_PAGE } from '@/utils/consts';
import { and, eq } from 'drizzle-orm';

export abstract class CommentRepository {

  static async getAll(postId: number, limit: number = MAX_ITEMS_PER_PAGE, offset: number = 0) {

    try {
      const data = await db.select().from(comments).where(eq(comments.postId, postId)).limit(limit).offset(offset);

      return data;
    } catch (error) {
      console.error(`Error fetching all comments from post ${postId}:`, error);
      throw error;
    }
  }

  static async getById(commentId: number) {

    try {
      const [data] = await db.select().from(comments).where(eq(comments.id, commentId));

      return data;
    } catch (error) {
      console.error(`Error fetching comment ${commentId}:`, error);
      throw error;
    }
  }

  static async getLike(commentId: number, userId: string) {

    try {
      const [existingLike] = await db.select().from(likes).where(and(
        eq(likes.commentId, commentId),
        eq(likes.userId, userId)
      )).limit(1);

      return existingLike
    } catch (error) {
      console.error(`Error fetching comment like in comment ${commentId}:`, error);
      throw error;
    }
  }

  static async increaseLikes(commentId: number, userId: string) {

    try {
      await db.insert(likes).values({
        commentId,
        userId
      });
    } catch (error) {
      console.error(`Error fetching comment like in comment ${commentId}:`, error);
      throw error;
    }
  }

  static async decreaseLikes(commentId: number, userId: string) {

    try {
      await db.delete(likes).where(and(
        eq(likes.commentId, commentId),
        eq(likes.userId, userId)
      ));
    } catch (error) {
      console.error(`Error fetching comment like in comment ${commentId}:`, error);
      throw error;
    }
  }

  static async save(body: string, postId: number, authorId: string) {

    try {
      const [data] = await db.insert(comments).values({ body, authorId, postId }).returning()

      return data;
    } catch (error) {
      console.error(`Error saving comment in post ${postId}:`, error);
      throw error;
    }
  }

  static async update(id: number, body: string) {

    try {
      const [data] = await db.update(comments).set({ body }).returning()

      return data;
    } catch (error) {
      console.error(`Error updating comment ${id}:`, error);
      throw error;
    }
  }

  static async remove(id: number) {

    try {
      const [data] = await db.delete(comments).where(eq(comments.id, id)).returning()

      return data;
    } catch (error) {
      console.error(`Error deleting comment:`, error);
      throw error;
    }
  }

}