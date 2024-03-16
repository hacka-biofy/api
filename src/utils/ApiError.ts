import { StatusCode } from 'hono/utils/http-status'

export class ApiError extends Error {
  statusCode: StatusCode
  isOperational: boolean

  constructor(statusCode: StatusCode, message: string, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
  }
}
