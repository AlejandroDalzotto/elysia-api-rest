import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from '@/routes/auth.route';
import { PORT } from '@/config/env';

const app = new Elysia({ prefix: '/api' })
  .onError(({ code, path, error }) => {

    console.error(`error [${code}] on [${path}] ${error}`)

  })
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

console.log(
  `📄 Go to docs: ${app.server?.url.href}api/docs`
);
