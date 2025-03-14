import { authMiddleware } from '@/middlewares/auth.middleware';
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
        term: t.String(),
      })
    )
  })

export const postsRoutes = new Elysia({ prefix: '/posts' })
  .use(authMiddleware)
  .use(postModels)
  .get('/', async ({ query: { limit, offset, term } }) => {

    if (term) {
      const postsFilteredByTerm = await PostService.findAllByTerm(term, limit, offset)

      return {
        data: postsFilteredByTerm
      }
    }

    const posts = await PostService.findAll(limit, offset)

    return {
      data: posts
    }
  }, {
    query: 'posts.get.query.req'
  })
  .get('/:id', async ({ params: { id } }) => {

    const post = await PostService.findById(id)

    return {
      data: post
    }
  }, {
    params: t.Object({
      id: t.Number()
    })
  })
  .put('/', async ({ body, userId, error }) => {

    if (userId !== body.authorId) {
      return error(403, 'Users cannot create posts on behalf of anothers.')
    }

    const postCreated = await PostService.create(body)

    return {
      data: postCreated
    }
  }, {
    auth: true,
    body: 'posts.create.body.req'
  })
  .patch('/:id', async ({ body, userId, error, params: { id } }) => {

    if (userId !== body.authorId) {
      return error(403, 'Users cannot modify posts on behalf of anothers.')
    }

    const postCreated = await PostService.update(body, id)

    return {
      data: postCreated
    }
  }, {
    auth: true,
    body: 'posts.update.body.req',
    params: t.Object({
      id: t.Number()
    })
  })
  .delete('/:id', async ({ userId, error, params: { id } }) => {

    const post = await PostService.findById(id)

    if (userId !== post.authorId) {
      return error(403, 'Users cannot delete posts on behalf of anothers.')
    }

    const data = await PostService.remove(id)

    return {
      data
    }
  }, {
    auth: true,
    params: t.Object({
      id: t.Number()
    })
  })