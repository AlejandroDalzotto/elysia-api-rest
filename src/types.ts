import { jwtPayloadSchema } from '@/elysia-schemas';

export type JwtPayload = typeof jwtPayloadSchema.static

export type ErrorCause = {
  detail: string
  status: number
}

export type OnErrorResponse = {
  code?: number
  message: string
  detail?: string
  path: string
}