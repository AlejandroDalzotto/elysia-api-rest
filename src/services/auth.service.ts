import { UserRepository } from '@/repositories/user.repository';
import type { InsertUser } from '@/db/schema/users.sql';
import { UniqueConstraintError } from '@/exceptions/uniqueconstrainterror.error';
import { AuthenticationError } from '@/exceptions/authentication.error';

export abstract class AuthService {

  static async register(newUser: InsertUser) {

    const isEmailAlreadyTaken = await UserRepository.getOneByEmail(newUser.email)
    if (isEmailAlreadyTaken) {
      throw new UniqueConstraintError('Error creating user', {
        detail: `Email ${newUser.email} is already taken, please provide another.`,
        status: 400
      })
    }

    const isUsernameAlreadyTaken = await UserRepository.getOneByUsername(newUser.username)
    if (isUsernameAlreadyTaken) {
      throw new UniqueConstraintError('Error creating user', {
        detail: `Username ${newUser.username} is already taken, please provide another.`,
        status: 400
      })
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
      throw new AuthenticationError('Error validating credentials', {
        detail: 'Invalid or missing email or password',
        status: 400
      })
    }

    const isPasswordValid = await Bun.password.verify(password, user.password)

    if (!isPasswordValid) {
      throw new AuthenticationError('Error validating credentials', {
        detail: 'Invalid or missing email or password',
        status: 400
      })
    }

    return {
      id: user.id,
      username: user.username
    }
  }
}