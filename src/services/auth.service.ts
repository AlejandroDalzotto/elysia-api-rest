import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { JWT_SECRET } from '@/config/env';
import { UserService } from './user.service';

export const authService = new Elysia({ name: 'services.auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      schema: t.Object({
        issuedAt: t.Number(),
        sub: t.Any(),
        expiresAt: t.Number()
      })
    })
  )
  .guard({
    cookie: t.Cookie({
      accessToken: t.Optional(t.String()),
      refreshToken: t.Optional(t.String())
    }, {
      httpOnly: true,
      secure: true,
    })
  })
  .macro({
    auth: {
      async resolve({ jwt, cookie: { accessToken, refreshToken }, error }) {

        if (!accessToken.value) {
          return error(401, 'Access token is missing')
        }

        const accessTokenPayload = await jwt.verify(accessToken.value)

        if (!accessTokenPayload) {
          // handle error for access token is tempted or incorrect
          return error(403, 'Access token\'s payload is invalid')
        }

        const now = Date.now()

        // Checks if token has expired.
        if (accessTokenPayload.expiresAt < now) {
          // We could refresh token here.
          console.log('❌ token expired')

          const refreshTokenPayload = await jwt.verify(refreshToken.value)

          if (!refreshTokenPayload) {
            // handle error for refresh token is tempted or incorrect
            return error(403, 'Refresh token\'s payload is invalid')
          }

          const userRefreshToken = await UserService.findOneByUsername(refreshTokenPayload.sub)

          if (!userRefreshToken) {
            return error(403, 'Refresh token is invalid')
          }

          const newAccessToken = await jwt.sign({
            sub: userRefreshToken.username,
            expiresAt: Date.now() + 60 * 60 * 24 * 1000, // 1 day
            issuedAt: now
          })

          accessToken.set({
            value: newAccessToken,
            httpOnly: true,
            secure: true,
          })

          const newRefreshToken = await jwt.sign({
            sub: userRefreshToken.username,
            expiresAt: Date.now() + 60 * 60 * 24 * 7 * 1000, // 7 days
            issuedAt: now
          })

          refreshToken.set({
            value: newRefreshToken,
            httpOnly: true,
            secure: true,
          })

          return {
            user: userRefreshToken.username
          }
        }

        const user = await UserService.findOneByUsername(accessTokenPayload.sub)

        if (!user) {
          return error(403, 'Access token is invalid')
        }

        return {
          user: user.username
        }
      }
    },
    role(value: string | false) {

      if (!value) return

      return {
        async beforeHandle({ jwt, cookie: { accessToken }, error }) {
          // TODO: implement role verification logic here.
        }
      }
    }
  })
