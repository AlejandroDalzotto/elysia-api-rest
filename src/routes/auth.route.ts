import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt'
import { UserService } from '@/services/user.service';
import { maxLengthUsername, minLengthEmail, minLengthPassword, minLengthUsername } from '@/lib/consts';
import { JWT_SECRET } from '@/config/env';

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
  .put('/sign-up', async ({ body, error, jwt }) => {

    const isEmailAlreadyTaken = await UserService.existByEmail(body.email)
    if (isEmailAlreadyTaken) {
      return error(400, `Email ${body.email} is already taken, please provide another.`)
    }

    const user = await UserService.create(body)

    const token = await jwt.sign({ id: user.id })

    return {
      data: user,
      token,
    }
  }, {
    body: 'signUp'
  })
  .post('/sign-in', async () => {

  }, {
    body: 'signIn'
  })