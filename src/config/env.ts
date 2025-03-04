import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('3000'),
  JWT_SECRET: z.string().min(16),
  NODE_ENV: z.optional(z.enum(['development', 'production'])).default('development'),
  DB_NAME: z.string(),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432'),
  DB_SSLMODE: z.string().default('prefer')
})

const { success, data, error } = envSchema.safeParse(process.env)

if (!success) {
  console.error('Error trying to load env variables:')
  console.error(error.message)
  process.exit(1)
}

export const {
  JWT_SECRET,
  NODE_ENV,
  PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_SSLMODE
} = data