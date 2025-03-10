import { authService } from '@/services/auth.service';
import { PostService } from '@/services/post.service';
import { Elysia, t } from 'elysia';

const postModels = new Elysia({ name: 'models.posts' })
  .model({
    'posts.create.body.req': t.Object({
      title: t.String(),
      body: t.String(),
      authorId: t.String()
    }),
    'posts.update.body.req': t.Object({
      title: t.Optional(t.String()),
      body: t.Optional(t.String()),
      authorId: t.String()
    }),
    'posts.get.query.req': t.Partial(
      t.Object({
        limit: t.Number(),
        offset: t.Number(),
      })
    )
  })

export const postsRoutes = new Elysia({ prefix: '/posts' })
  .use(authService)
  .use(postModels)
  .get('/', async ({ query: { limit, offset } }) => {

    const posts = await PostService.findAll(limit, offset)

    return {
      data: posts
    }
  }, {
    auth: true,
    query: 'posts.get.query.req'
  })