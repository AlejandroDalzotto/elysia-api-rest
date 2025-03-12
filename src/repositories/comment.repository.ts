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

  static async save(body: string, postId: number, authorId: string) {

    try {
      const [data] = await db.insert(comments).values({ body, authorId, postId }).returning()

      return data;
    } catch (error) {
      console.error(`Error saving comment in post ${postId}:`, error);
      throw error;
    }
  }

}