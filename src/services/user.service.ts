import { UserRepository } from '@/repositories/user.repository';
import { NotFoundError } from 'elysia';

export abstract class UserService {

  static async findAll() {
    const data = UserRepository.getAll()

    return data
  }

  static async findOneByUsername(username: string) {
    const user = await UserRepository.getOneByUsername(username)

    if (!user) {
      throw new NotFoundError(`User ${username} not found. Please provide a correct username.`)
    }

    return user
  }

  static async existByEmail(email: string) {

    const data = await UserRepository.getOneByEmail(email)

    return Boolean(data && data.email)
  }
}