import { DatabaseError } from 'pg';
import { AppDatabaseError } from '@/exceptions/appdatabase.error';
import { DrizzleError, TransactionRollbackError } from 'drizzle-orm';

export function handleDatabaseError(error: unknown, errorMessage: string): never {
  if (error instanceof DatabaseError) {
    switch (error.code) {
      case '23505': throw new AppDatabaseError(errorMessage, {
        detail: error.message,
        status: 409
      }) // unique violation
      case '23503': throw new AppDatabaseError(errorMessage, {
        detail: error.message,
        status: 409
      }) // foreign key violation
      default: throw new AppDatabaseError(errorMessage, {
        detail: error.message,
        status: 500
      })
    }
  }

  if (error instanceof TransactionRollbackError) {
    throw new AppDatabaseError(
      errorMessage,
      {
        status: 500,
        detail: error.message
      }
    )
  }

  if (error instanceof DrizzleError) {
    throw new AppDatabaseError(
      errorMessage,
      {
        status: 500,
        detail: error.message
      }
    )
  }

  if (error instanceof Error) {
    throw new AppDatabaseError(
      errorMessage,
      {
        status: 500,
        detail: error.message
      }
    )
  }

  throw new AppDatabaseError(errorMessage, { status: 500, detail: 'Unknown error' });
}