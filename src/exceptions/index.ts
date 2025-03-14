import { Elysia } from 'elysia';
import { AppDatabaseError } from '@/exceptions/appdatabase.error';
import { InvalidJwtError } from '@/exceptions/invalidjwt.error';
import { AuthorizationError } from '@/exceptions/authorization.error';
import { JwtNotProvidedError } from '@/exceptions/jwtnotprovided.error';
import type { OnErrorResponse } from '@/types';
import { AuthenticationError } from '@/exceptions/authentication.error';
import { UniqueConstraintError } from '@/exceptions/uniqueconstrainterror.error';

const errorHandlers: Record<string, (error: any, path: string) => OnErrorResponse> = {
  'APP_DATABASE': (error, path) => ({
    code: error.cause?.status,
    message: error.message,
    detail: error.cause?.detail,
    path,
  }),
  'INTERNAL_SERVER_ERROR': (error, path) => ({
    code: 500,
    message: 'Internal server error',
    detail: error.message,
    path,
  }),
  'NOT_FOUND': (error, path) => ({
    code: 404,
    message: 'Not found',
    detail: error.message,
    path,
  }),
  'INVALID_COOKIE_SIGNATURE': (error, path) => ({
    code: 401,
    message: 'Unauthorized',
    detail: error.message,
    path,
  }),
  'INVALID_JWT': (error, path) => ({
    code: 401,
    message: error.message,
    detail: error.cause?.detail,
    path,
  }),
  'INVALID_ROLE': (error, path) => ({
    code: 403,
    message: error.message,
    detail: error.cause?.detail,
    path,
  }),
  'JWT_NOT_PROVIDED': (error, path) => ({
    code: 403,
    message: error.message,
    detail: error.cause?.detail,
    path,
  }),
  'AUTHENTICATION': (error, path) => ({
    code: 400,
    message: error.message,
    detail: error.cause?.detail,
    path,
  }),
  'UNIQUE_CONSTRAINT': (error, path) => ({
    code: 409,
    message: error.message,
    detail: error.cause?.detail,
    path,
  }),
};

export const globalErrorHandler = new Elysia({ name: 'errors.handler' })
  .error('APP_DATABASE', AppDatabaseError)
  .error('INVALID_JWT', InvalidJwtError)
  .error('INVALID_ROLE', AuthorizationError)
  .error('JWT_NOT_PROVIDED', JwtNotProvidedError)
  .error('AUTHENTICATION', AuthenticationError)
  .error('UNIQUE_CONSTRAINT', UniqueConstraintError)
  .onError({ as: 'global' }, ({ code, path, error, set }) => {
    const handler = errorHandlers[code] || errorHandlers['INTERNAL_SERVER_ERROR'];
    const errorResult =  handler(error, path);
    
    set.status = errorResult.code;

    return errorResult;
  });
