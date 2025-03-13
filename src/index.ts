import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from '@/routes/auth.route';
import { PORT } from '@/config/env';
import { postsRoutes } from './routes/post.route';
import { commentsRoutes } from './routes/comment.route';
import { globalErrorHandler } from '@/exceptions';

const app = new Elysia({ prefix: '/api' })
  .use(globalErrorHandler)
  .use(swagger({
    autoDarkMode: true,
    path: '/docs',
    exclude: ['/api/docs', '/api/docs/json']
  }))
  .use(authRoutes)
  .use(postsRoutes)
  .use(commentsRoutes)
  .listen(PORT);

console.log(
  `🦊 Server is running at ${app.server?.url.href}`
);

console.log(
  `📄 Go to docs: ${app.server?.url.href}api/docs`
);
