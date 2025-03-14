import type { ErrorCause } from "@/types"

export class AuthorizationError extends Error {

  readonly message: string
  readonly cause?: ErrorCause

  constructor(message: string, cause?: ErrorCause) {
    super(message)
    this.message = message
    this.cause = cause
  }

}