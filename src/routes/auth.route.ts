import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt'
import { UserService } from '@/services/user.service';
import { maxLengthUsername, minLengthEmail, minLengthPassword, minLengthUsername } from '@/lib/consts';
import { JWT_SECRET } from '@/config/env';
import { db } from '@/db';
import { users } from '@/db/schema/users.sql';

const authModels = new Elysia({ name: 'models.auth' })
  .model({
    signIn: t.Object({
      email: t.String({ format: 'email', minLength: minLengthEmail }),
      password: t.String({ minLength: minLengthPassword })
    }),
    signUp: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: minLengthPassword }),
      username: t.String({ minLength: minLengthUsername, maxLength: maxLengthUsername })
    }),
  })

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(authModels)
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET
    })
  )
  .put('/sign-up', async ({ body, error }) => {

    const { email, password, username } = body

    const isEmailAlreadyTaken = await UserService.existByEmail(email)
    if (isEmailAlreadyTaken) {
      return error(400, `Email ${email} is already taken, please provide another.`)
    }

    const encryptedPassword = await Bun.password.hash(password)

    const user = await UserService.create({ email, password: encryptedPassword, username })

    return {
      data: user
    }
  }, {
    body: 'signUp'
  })
  .post('/sign-in', async () => {

  }, {
    body: 'signIn'
  })
  .get('/get-all', async () => {
    const usersData = await db.select().from(users)

    return {
      data: usersData
    }
  })