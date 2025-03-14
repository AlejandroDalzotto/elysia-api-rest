import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { JWT_SECRET } from '@/config/env';
import { UserService } from '@/services/user.service';
import { generateToken, verifyToken } from '@/utils/jwt';
import { ACCESS_TOKEN_EXPIRATION_MILISECONDS, REFRESH_TOKEN_EXPIRATION_MILISECONDS } from '@/utils/consts';
import { jwtPayloadSchema } from '@/elysia-schemas';
import type { Role } from '@/db/schema/users.sql';
import { InvalidJwtError } from '@/exceptions/invalidjwt.error';
import { JwtNotProvidedError } from '@/exceptions/jwtnotprovided.error';
import { AuthorizationError } from '@/exceptions/authorization.error';

export const authMiddleware = new Elysia({ name: 'middlewares.auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      schema: jwtPayloadSchema
    })
  )
  .macro({
    auth: {
      async resolve({ jwt, cookie: { accessToken, refreshToken } }) {

        if (!accessToken.value || !refreshToken.value) {
          throw new JwtNotProvidedError('Either access or refresh token are missing', { status: 403, detail: 'Token is missing, please make sure to provide both access and refresh tokens' });
        }

        const accessTokenPayload = await verifyToken(accessToken.value, 'access', { jwt });

        const now = Date.now();
        if (accessTokenPayload.expiresAt < now) {
          // ❌ token expired

          // We have to validate the type of the verification result, if we don't we won't have the typescript inference.
          const refreshTokenPayload = await verifyToken(refreshToken.value, 'refresh', { jwt });

          const userRefreshToken = await UserService.findOneByUsername(refreshTokenPayload.sub);
          if (!userRefreshToken) {
            throw new InvalidJwtError('Refresh token is invalid', { status: 403, detail: 'The integrity of the token might be affected' });
          }

          // Sign new tokens to renew the older ones.
          const newAccessToken = await generateToken(userRefreshToken.username, ACCESS_TOKEN_EXPIRATION_MILISECONDS, { jwt }); // 1 day
          accessToken.set({ value: newAccessToken, httpOnly: true, secure: true });

          const newRefreshToken = await generateToken(userRefreshToken.username, REFRESH_TOKEN_EXPIRATION_MILISECONDS, { jwt }); // 7 days
          refreshToken.set({ value: newRefreshToken, httpOnly: true, secure: true });

          return { userId: userRefreshToken.id };
        }

        const user = await UserService.findOneByUsername(accessTokenPayload.sub);
        if (!user) {
          throw new InvalidJwtError('Acess token is invalid', { status: 403, detail: 'The integrity of the token might be affected' });
        }

        return { userId: user.id };
      }
    },
    role(value: Role | false) {

      if (!value) return

      return {
        async beforeHandle({ jwt, cookie: { accessToken } }) {

          const payload = await jwt.verify(accessToken.value!)

          if (!payload) throw new JwtNotProvidedError('Access token is invalid', { status: 401, detail: 'Please provide a valid access token' })

          const user = await UserService.findOneByUsername(payload.sub)
          if (user.role !== value) {
            throw new AuthorizationError('Unathorized action for user', { status: 403, detail: 'User doesn\'t have permissions to perform this action' })
          }
        }
      }
    }
  })
