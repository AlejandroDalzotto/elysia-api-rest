import type { InferContext } from 'elysia';
import type { JwtPayload } from '@/types';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { InvalidJwtError } from '@/exceptions/invalidjwt.error';

export async function verifyToken(
  token: string,
  tokenType: 'access' | 'refresh',
  { jwt }: Pick<InferContext<typeof authMiddleware>, | 'jwt'>
): Promise<JwtPayload> {
  const payload = await jwt.verify(token);
  if (!payload) {
    throw new InvalidJwtError(`Failed to verify ${tokenType} token`, {
      status: 403,
      detail: `${tokenType} token is invalid`
    });
  }
  return payload;
}

export async function generateToken(
  sub: string,
  expiresIn: number,
  { jwt }: Pick<InferContext<typeof authMiddleware>, | 'jwt'>
) {
  const now = Date.now();
  return await jwt.sign({
    sub: sub,
    expiresAt: now + expiresIn,
    issuedAt: now
  });
}