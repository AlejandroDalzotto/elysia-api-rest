import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { type InsertUser, type SelectUser, users } from '@/db/schema/users.sql';
import { handleDatabaseError } from '@/exceptions/helpers/database.error.handler';

export abstract class UserRepository {

  static async getAll() {
    try {
      const data = await db.select().from(users);
      return data;
    } catch (error) {
      handleDatabaseError(error, 'Error fetching all users in database');
    }
  }

  static async getOneById(id: string) {
    try {
      const [data] = await db.select().from(users).where(eq(users.id, id));
      return data;
    } catch (error) {
      handleDatabaseError(error, `Error fetching user by ID ${id}`);
    }
  }

  static async getOneByEmail(email: string) {
    try {
      const [data] = await db.select().from(users).where(eq(users.email, email));
      return data;
    } catch (error) {
      handleDatabaseError(error, `Error fetching user by email ${email}`);
    }
  }

  static async getOneByUsername(username: string) {
    try {
      const [data] = await db.select().from(users).where(eq(users.username, username));
      return data;
    } catch (error) {
      handleDatabaseError(error, `Error fetching user by username ${username}`);
    }
  }

  static async save(body: InsertUser) {
    try {
      const [data] = await db.insert(users).values(body).returning({ insertedId: users.id });
      return data;
    } catch (error) {
      handleDatabaseError(error, 'Error saving user');
    }
  }

  static async update(id: string, body: Partial<SelectUser>) {
    try {
      const [data] = await db.update(users).set(body).where(eq(users.id, id)).returning({ updatedId: users.id });
      return data;
    } catch (error) {
      handleDatabaseError(error, `Error updating user with ID ${id}`);
    }
  }

  static async remove(id: string) {
    try {
      const [data] = await db.delete(users).where(eq(users.id, id)).returning({ deletedId: users.id });
      return data;
    } catch (error) {
      handleDatabaseError(error, `Error removing user with ID ${id}`);
    }
  }

}
