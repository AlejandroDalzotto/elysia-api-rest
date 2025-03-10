import { db } from '@/db';
import { posts } from '@/db/schema/posts.sql';
import { MAX_ITEMS_PER_PAGE } from '@/utils/consts';
import { and, ilike, type SQL } from 'drizzle-orm';

type Filters = {
  term?: string
}

export abstract class PostRepository {

  static async getAll(limit: number = MAX_ITEMS_PER_PAGE, offset: number = 0) {

    try {
      const data = await db.select().from(posts).limit(limit).offset(offset);

      return data;
    } catch (error) {
      console.error('Error fetching all posts:', error);
      throw error;
    }
  }

  static async getAllByFilter({ term }: Filters, limit: number = MAX_ITEMS_PER_PAGE, offset: number = 0) {
    const filters: SQL[] = []

    if (term) filters.push(ilike(posts.title, term));

    try {
      const data = await db.select().from(posts).where(and(...filters)).limit(limit).offset(offset);
      return data;
    } catch (error) {
      console.error('Error fetching all posts:', error);
      throw error;
    }
  }

}