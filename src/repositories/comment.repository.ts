import { db } from '@/db';
import { comments } from '@/db/schema/comments.sql';
import { MAX_ITEMS_PER_PAGE } from '@/utils/consts';
import { eq } from 'drizzle-orm';

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

}