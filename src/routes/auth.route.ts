import { Elysia, t } from 'elysia';
import { UserService } from '@/services/user.service';
import { maxLengthUsername, minLengthEmail, minLengthPassword, minLengthUsername } from '@/utils/consts';
import { db } from '@/db';
import { users } from '@/db/schema/users.sql';
import { authService } from '@/services/auth.service';

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
  .use(authService)
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
  .post('/sign-in', async ({ body, error, jwt, cookie }) => {

    const { password, email } = body

    const isEmailAlreadyTaken = await UserService.existByEmail(email)
    if (!isEmailAlreadyTaken) {
      return error(404, 'Invalid or missing email or password')
    }

    const userFromDb = await UserService.findOneByEmail(email)

    const encryptedPassword = userFromDb.password
    const isValid = await Bun.password.verify(password, encryptedPassword)

    if (!isValid) {
      return error(400, 'Invalid or missing email or password')
    }

    const accessTokenValue = await jwt.sign({
      sub: userFromDb.username,
      expiresAt: Date.now() + 60 * 60 * 24 * 1000, // 1 day
      issuedAt: Date.now()
    })

    const refreshTokenValue = await jwt.sign({
      sub: userFromDb.username,
      expiresAt: Date.now() + 60 * 60 * 24 * 7 * 1000, // 7 days
      issuedAt: Date.now()
    })

    cookie.accessToken.set({
      value: accessTokenValue,
      httpOnly: true,
      secure: true,
    })

    cookie.refreshToken.set({
      value: refreshTokenValue,
      httpOnly: true,
      secure: true,
    })

    return {
      data: {
        username: userFromDb.username
      },
      accessToken: accessTokenValue,
      refreshToken: refreshTokenValue
    }

  }, {
    body: 'signIn'
  })
  .get('/get-all', async () => {
    const usersData = await db.select().from(users)
    return {
      data: usersData
    }
  }, {
    auth: true,
    role: 'admin',
  })