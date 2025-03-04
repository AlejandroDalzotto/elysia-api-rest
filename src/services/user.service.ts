import { InsertUser } from '@/db/schema/users.sql';
import { UserRepository } from '@/repositories/user.repository';

export abstract class UserService {
  static async findAll() {
    const data = UserRepository.getAll()

    return data
  }
  static async findOneById(id: unknown) { }
  static async create(body: InsertUser) {
    const data = await UserRepository.save(body)

    return data
  }
  static async update(id: unknown, body: Partial<unknown>) { }
  static async remove(id: unknown) { }
  static async existByEmail(email: string) {

    const data = await UserRepository.getOneByEmail(email)

    return Boolean(data.email)
  }
}