import { t, Elysia } from 'elysia';
import {
  maxLengthUsername,
  minLengthEmail,
  minLengthPassword,
  minLengthUsername
} from '@/utils/consts';

export const authModels = new Elysia({ name: 'models.auth' })
  .model({
    'auth.signin.body.req': t.Object({
      email: t.String({
        format: 'email',
        minLength: minLengthEmail,
        description: 'Email of the user (at least 3 characters)'
      }),
      password: t.String({
        minLength: minLengthPassword,
        description: 'Password of the user (at least 6 characters)'
      })
    }),
    'auth.signup.body.req': t.Object({
      email: t.String({
        format: 'email',
        minLength: minLengthEmail,
        description: 'Email of the user (at least 3 characters)'
      }),
      password: t.String({
        minLength: minLengthPassword,
        description: 'Password of the user (at least 6 characters)'
      }),
      username: t.String({
        minLength: minLengthUsername,
        maxLength: maxLengthUsername,
        description: 'Username of the user (at least 3 characters)'
      })
    }),
  })