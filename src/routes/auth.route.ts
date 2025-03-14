import { Elysia } from 'elysia';
import { UserService } from '@/services/user.service';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authModels } from '@/models/auth';
import { generateToken } from '@/utils/jwt';
import { AuthService } from '@/services/auth.service';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(authModels)
  .use(authMiddleware)
  .put('/sign-up', async ({ body }) => {

    const { email, password, username } = body

    const user = await AuthService.register({ email, password, username })

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
  .post('/sign-in', async ({ body, jwt, cookie }) => {

    const { password, email } = body

    const data = await AuthService.validateCredentials(email, password)

    const accessTokenExpirationDate = Date.now() + 60 * 60 * 24 * 1000 // 1 day
    const refreshTokenExpirationDate = Date.now() + 60 * 60 * 24 * 7 * 1000 // 7 days

    const accessTokenValue = await generateToken(data.username, accessTokenExpirationDate, { jwt })
    const refreshTokenValue = await generateToken(data.username, refreshTokenExpirationDate, { jwt })

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
        id: data.id
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
    const usersData = await UserService.findAll()
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