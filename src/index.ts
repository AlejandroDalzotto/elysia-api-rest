import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from '@/routes/auth.route';
import { PORT } from '@/config/env';

const app = new Elysia({ prefix: '/api' })
  .use(swagger({
    autoDarkMode: true,
    path: '/docs',
    exclude: ['/api/docs', '/api/docs/json']
  }))
  .use(authRoutes)
  .listen(PORT);

console.log(
  `🦊 Server is running at ${app.server?.url.href}`
);
