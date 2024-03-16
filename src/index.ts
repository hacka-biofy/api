import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { rateLimit } from './middlewares/rateLimiter'
import { ApiError } from './utils/ApiError'

const app = new Hono()
const accessMap = new Map()
app.use(secureHeaders())

app.get('/', rateLimit(accessMap), (c) => {
  return c.text('Olá! Seja bem-vindo :)', 200);
})

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  console.log(body['file'])
})

app.get('/health', (c) => c.text('Health Ok!', 200))

app.onError((err, c) => {
  let a = err as ApiError
  console.error(`${err}`)
  return c.text('Atenção! Você atingiu o limite de requisições por minuto.', a.statusCode)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
