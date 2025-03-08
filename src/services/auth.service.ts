import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';

import { JWT_SECRET } from '@/config/env';
import { UserService } from '@/services/user.service';
import type { Role } from '@/db/schema/users.sql';
import { generateToken, verifyToken } from '@/utils/jwt';
import { ACCESS_TOKEN_EXPIRATION_MILISECONDS, REFRESH_TOKEN_EXPIRATION_MILISECONDS } from '@/utils/consts';

const jwtPayloadSchema = t.Object({
  issuedAt: t.Number(),
  sub: t.Any(),
  expiresAt: t.Number()
})

export type JwtPayload = typeof jwtPayloadSchema.static

export const authService = new Elysia({ name: 'services.auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      schema: jwtPayloadSchema
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

        if (!accessToken.value || !refreshToken.value) {
          return error(401, 'Either access or refresh token are missing');
        }

        const accessTokenPayload = await verifyToken(accessToken.value, 'access', { jwt });
        if ('message' in accessTokenPayload) return error(accessTokenPayload.code, accessTokenPayload.message);

        const now = Date.now();
        if (accessTokenPayload.expiresAt < now) {
          // ❌ token expired

          // We have to validate the type of the verification result, if we don't we won't have the typescript inference.
          const refreshTokenPayload = await verifyToken(refreshToken.value, 'refresh', { jwt });
          if ('message' in refreshTokenPayload) return error(refreshTokenPayload.code, refreshTokenPayload.message);

          const userRefreshToken = await UserService.findOneByUsername(refreshTokenPayload.sub);
          if (!userRefreshToken) {
            return error(403, 'Refresh token is invalid');
          }

          // Sign new tokens to renew the older ones.
          const newAccessToken = await generateToken(userRefreshToken.username, ACCESS_TOKEN_EXPIRATION_MILISECONDS, { jwt }); // 1 day
          accessToken.set({ value: newAccessToken, httpOnly: true, secure: true });

          const newRefreshToken = await generateToken(userRefreshToken.username, REFRESH_TOKEN_EXPIRATION_MILISECONDS, { jwt }); // 7 days
          refreshToken.set({ value: newRefreshToken, httpOnly: true, secure: true });

          return { user: userRefreshToken.username };
        }

        const user = await UserService.findOneByUsername(accessTokenPayload.sub);
        if (!user) {
          return error(403, 'Access token is invalid');
        }

        return { user: user.username };
      }
    },
    role(value: Role | false) {

      if (!value) return

      return {
        async beforeHandle({ jwt, cookie: { accessToken }, error }) {

          const payload = await jwt.verify(accessToken.value!)

          if (!payload) return error(401, 'Access token is invalid')

          const user = await UserService.findOneByUsername(payload.sub)
          if (user.role !== value) {
            return error(403, 'You don\'t have permissions to perform this action.')
          }
        }
      }
    }
  })
