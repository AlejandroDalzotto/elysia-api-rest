import { type InferContext } from 'elysia';
import { authService } from '@/services/auth.service';
import type { ErrorMessage, JwtPayload } from '@/types';

export async function verifyToken(
  token: string,
  tokenType: 'access' | 'refresh',
  { jwt }: Pick<InferContext<typeof authService>, | 'jwt'>
): Promise<JwtPayload | ErrorMessage> {
  const payload = await jwt.verify(token);
  if (!payload) {
    return {
      code: 403,
      message: `${tokenType} token's payload is invalid`
    }
  }
  return payload;
}

export async function generateToken(
  sub: string,
  expiresIn: number,
  { jwt }: Pick<InferContext<typeof authService>, | 'jwt'>
) {
  const now = Date.now();
  return await jwt.sign({
    sub: sub,
    expiresAt: now + expiresIn,
    issuedAt: now
  });
}