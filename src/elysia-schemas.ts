import { t } from 'elysia';

export const jwtPayloadSchema = t.Object({
  issuedAt: t.Number(),
  sub: t.Any(),
  expiresAt: t.Number()
})