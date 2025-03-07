import { db } from '@/db';
import { InsertUser, users } from '@/db/schema/users.sql';
import { eq } from 'drizzle-orm';

export abstract class UserRepository {

  static async getAll() {
    const data = await db.select().from(users)

    return data
  }

  static async getOneById(id: unknown) {
    throw new Error('method not implemented yet')
  }

  static async getOneByEmail(email: string) {
    const [data] = await db.select().from(users).where(eq(users.email, email))

    return data
  }

  static async getOneByUsername(username: string) {
    const [data] = await db.select().from(users).where(eq(users.username, username))

    return data
  }

  static async save(body: InsertUser) {
    const [data] = await db.insert(users).values(body).returning({ insertedId: users.id });

    return data
  }

  static async update(id: unknown, body: Partial<unknown>) {
    throw new Error('method not implemented yet')
  }

  static async remove(id: unknown) {
    throw new Error('method not implemented yet')
  }

}