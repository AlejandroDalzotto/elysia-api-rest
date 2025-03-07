import { UserRepository } from '@/repositories/user.repository';
import type { InsertUser } from '@/db/schema/users.sql';

export abstract class UserService {
  static async findAll() {
    const data = UserRepository.getAll()

    return data
  }
  static async findOneById(id: string) { }
  static async findOneByEmail(email: string) {
    const data = await UserRepository.getOneByEmail(email)

    return data
  }
  static async findOneByUsername(username: string) {
    const data = await UserRepository.getOneByUsername(username)

    return data
  }
  static async create(body: InsertUser) {
    const data = await UserRepository.save(body)

    return data
  }
  static async update(id: string, body: InsertUser) { }
  static async remove(id: string) { }
  static async existByEmail(email: string) {

    const data = await UserRepository.getOneByEmail(email)

    return Boolean(data && data?.email)
  }
}