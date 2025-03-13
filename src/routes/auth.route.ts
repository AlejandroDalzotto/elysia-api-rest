import { Elysia, t } from 'elysia';
import { UserService } from '@/services/user.service';
import { maxLengthUsername, minLengthEmail, minLengthPassword, minLengthUsername } from '@/utils/consts';
import { db } from '@/db';
import { users } from '@/db/schema/users.sql';
import { authService } from '@/services/auth.service';

const authModels = new Elysia({ name: 'models.auth' })
  .model({
    'auth.signin.body.req': t.Object({
      email: t.String({
        format: 'email',
        minLength: minLengthEmail,
        description: 'Email of the user (at least 3 characters)'
      }),
      password: t.String({
        minLength: minLengthPassword,
        description: 'Password of the user (at least 6 characters)'
      })
    }),
    'auth.signup.body.req': t.Object({
      email: t.String({
        format: 'email',
        minLength: minLengthEmail,
        description: 'Email of the user (at least 3 characters)'
      }),
      password: t.String({
        minLength: minLengthPassword,
        description: 'Password of the user (at least 6 characters)'
      }),
      username: t.String({
        minLength: minLengthUsername,
        maxLength: maxLengthUsername,
        description: 'Username of the user (at least 3 characters)'
      })
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
    body: 'auth.signup.body.req',
    detail: {
      tags: ['authentication'],
      summary: 'Create a new user',
    }
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
        id: userFromDb.id
      },
      accessToken: accessTokenValue,
      refreshToken: refreshTokenValue
    }

  }, {
    body: 'auth.signin.body.req',
    detail: {
      tags: ['authentication'],
      summary: 'Sign in a user',
    }
  })
  .get('/get-all', async () => {
    const usersData = await db.select().from(users)
    return {
      data: usersData
    }
  }, {
    auth: true,
    role: 'admin',
    detail: {
      tags: ['users'],
      summary: 'Get all users (admin only)',
      description: 'This route is only available for admin users and it\'s for testing purposes only.'
    }
  })