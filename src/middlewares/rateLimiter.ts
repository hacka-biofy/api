import { Context, MiddlewareHandler } from 'hono'
import { ApiError } from '../utils/ApiError'
import moment from 'moment'

const WINDOW_SIZE_IN_MINUTES = 1
const MAX_WINDOW_REQUEST_COUNT = 700

const setRateLimitHeaders = (
  c: Context,
  secondsExpires: number,
  limit: number,
  remaining: number,
  interval: number
) => {
  c.header('X-RateLimit-Reset', secondsExpires.toString())
  c.header('X-RateLimit-Limit', limit.toString())
  c.header('X-RateLimit-Remaining', remaining.toString())
  c.header('X-RateLimit-Policy', `${limit};w=${interval};comment="Sliding window"`)
}

export const rateLimit = (accessMap: Map<string, object>): MiddlewareHandler<Environment> => {
  return async (c, next) => {
    const currentRequestTime = moment()
    const ip = c.req.header('x-forwarded-for') || 'indefinido' // TODO: Validar identificação do IP conforme servidor utilizado
    const record = accessMap.get(ip)
    if (record == null) {
      let requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1
      }
      console.log(ip, requestLog)
      accessMap.set(ip, requestLog)
      setRateLimitHeaders(
        c,
        WINDOW_SIZE_IN_MINUTES * 60,
        MAX_WINDOW_REQUEST_COUNT,
        MAX_WINDOW_REQUEST_COUNT - 1,
        WINDOW_SIZE_IN_MINUTES * 60
      )
    } else {
      let data = record as { requestTimeStamp: number; requestCount: number }
      let windowStartTimestamp = moment().subtract(WINDOW_SIZE_IN_MINUTES, 'minutes').unix()

      if (data.requestTimeStamp > windowStartTimestamp) {
        if (data.requestCount >= MAX_WINDOW_REQUEST_COUNT) {
          console.log('429')
          setRateLimitHeaders(
            c,
            WINDOW_SIZE_IN_MINUTES * 60 - currentRequestTime.unix() + data.requestTimeStamp,
            MAX_WINDOW_REQUEST_COUNT,
            0,
            WINDOW_SIZE_IN_MINUTES * 60
          )
          throw new ApiError(429, 'Too many requests')
        } else {
          data.requestCount++
          setRateLimitHeaders(
            c,
            WINDOW_SIZE_IN_MINUTES * 60 - currentRequestTime.unix() + data.requestTimeStamp,
            MAX_WINDOW_REQUEST_COUNT,
            MAX_WINDOW_REQUEST_COUNT - data.requestCount,
            WINDOW_SIZE_IN_MINUTES * 60
          )
        }
      } else {
        data.requestTimeStamp = currentRequestTime.unix()
        data.requestCount = 1
        setRateLimitHeaders(
          c,
          WINDOW_SIZE_IN_MINUTES * 60,
          MAX_WINDOW_REQUEST_COUNT,
          MAX_WINDOW_REQUEST_COUNT - 1,
          WINDOW_SIZE_IN_MINUTES * 60
        )
      }
      console.log(ip, data)
      accessMap.set(ip, data)
    }
    await next()
  }
}
