import type { ErrorCause } from "@/types"

export class UniqueConstraintError extends Error {

  readonly message: string
  readonly cause?: ErrorCause

  constructor(message: string, cause?: ErrorCause) {
    super(message)
    this.message = message
    this.cause = cause
  }

}