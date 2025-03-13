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
  static async create(newUser: InsertUser) {

    const isEmailAlreadyTaken = await UserRepository.getOneByEmail(newUser.email)
    if (isEmailAlreadyTaken) {
      throw new Error(`Email ${newUser.email} is already taken, please provide another.`)
    }

    const isUsernameAlreadyTaken = await UserRepository.getOneByUsername(newUser.username)
    if (isUsernameAlreadyTaken) {
      throw new Error(`Username ${newUser.username} is already taken, please provide another.`)
    }

    const encryptedPassword = await Bun.password.hash(newUser.password)
    const data = await UserRepository.save({
      email: newUser.email,
      username: newUser.username,
      password: encryptedPassword
    })

    return data
  }

  static async validateCredentials(email: string, password: string) {

    // We should validate if user with a certain email exist.
    const user = await UserRepository.getOneByEmail(email)
    if (!user) {
      throw new Error('Invalid or missing email or password')
    }

    const isPasswordValid = await Bun.password.verify(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid or missing email or password')
    }

    return {
      id: user.id,
      username: user.username
    }
  }

  static async update(id: string, body: InsertUser) { }
  static async remove(id: string) { }
  static async existByEmail(email: string) {

    const data = await UserRepository.getOneByEmail(email)

    return Boolean(data && data?.email)
  }
}