import { db } from '@/db';
import { type InsertPost, posts } from '@/db/schema/posts.sql';
import { MAX_ITEMS_PER_PAGE } from '@/utils/consts';
import { and, eq, ilike, type SQL } from 'drizzle-orm';

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

  static async getById(id: number) {

    try {
      const [data] = await db.select().from(posts).where(eq(posts.id, id));
      return data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  }

  static async save(body: InsertPost) {

    try {
      const [data] = await db.insert(posts).values(body).returning();
      return data;
    } catch (error) {
      console.error(`Error saving post in database:`, error);
      throw error;
    }
  }

}