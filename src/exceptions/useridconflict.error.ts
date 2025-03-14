import type { ErrorCause } from "@/types"

export class UserIdConflictError extends Error {

  readonly message: string
  readonly cause?: ErrorCause

  constructor(message: string) {
    super(message)
    this.message = message
    this.cause = {
      status: 403,
      detail: 'Users cannot perform actions on behalf of others.'
    }
  }

}