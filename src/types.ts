import { errorSchema, jwtPayloadSchema } from '@/elysia-schemas';

export type ErrorMessage = typeof errorSchema.static

export type JwtPayload = typeof jwtPayloadSchema.static