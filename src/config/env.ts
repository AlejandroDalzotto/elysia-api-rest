import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  NODE_ENV: z.optional(z.enum(['development', 'production'])).default('development')
})

const { success, data, error } = envSchema.safeParse(Bun.env)

if (!success) {
  console.error(`Error trying to load env variables: ${error.format()}`)
  process.exit(1)
}

export const {
  DATABASE_URL,
  JWT_SECRET,
  NODE_ENV,
  PORT
} = data