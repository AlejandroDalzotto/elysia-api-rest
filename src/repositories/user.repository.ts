import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { type InsertUser, type SelectUser, users } from '@/db/schema/users.sql';

export abstract class UserRepository {

  static async getAll() {
    try {
      const data = await db.select().from(users);
      return data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  static async getOneById(id: string) {
    try {
      const [data] = await db.select().from(users).where(eq(users.id, id));
      return data;
    } catch (error) {
      console.error(`Error fetching user by ID ${id}:`, error);
      throw error;
    }
  }

  static async getOneByEmail(email: string) {
    try {
      const [data] = await db.select().from(users).where(eq(users.email, email));
      return data;
    } catch (error) {
      console.error(`Error fetching user by email ${email}:`, error);
      throw error;
    }
  }

  static async getOneByUsername(username: string) {
    try {
      const [data] = await db.select().from(users).where(eq(users.username, username));
      return data;
    } catch (error) {
      console.error(`Error fetching user by username ${username}:`, error);
      throw error;
    }
  }

  static async save(body: InsertUser) {
    try {
      const [data] = await db.insert(users).values(body).returning({ insertedId: users.id });
      return data;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  static async update(id: string, body: Partial<SelectUser>) {
    try {
      const [data] = await db.update(users).set(body).where(eq(users.id, id)).returning({ updatedId: users.id });
      return data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  static async remove(id: string) {
    try {
      const [data] = await db.delete(users).where(eq(users.id, id)).returning({ deletedId: users.id });
      return data;
    } catch (error) {
      console.error(`Error removing user with ID ${id}:`, error);
      throw error;
    }
  }

}