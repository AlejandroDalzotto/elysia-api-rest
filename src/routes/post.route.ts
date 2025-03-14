import { UserIdConflictError } from '@/exceptions/useridconflict.error';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { postModels } from '@/models/post';
import { PostService } from '@/services/post.service';
import { Elysia } from 'elysia';

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
    params: 'posts.get.params.req'
  })
  .put('/', async ({ body, userId }) => {

    if (userId !== body.authorId) {
      throw new UserIdConflictError('Error while creating post.')
    }

    const postCreated = await PostService.create(body)

    return {
      data: postCreated
    }
  }, {
    auth: true,
    body: 'posts.create.body.req'
  })
  .patch('/:id', async ({ body, userId, params: { id } }) => {

    if (userId !== body.authorId) {
      throw new UserIdConflictError('Error while updating post.')
    }

    const postCreated = await PostService.update(body, id)

    return {
      data: postCreated
    }
  }, {
    auth: true,
    body: 'posts.update.body.req',
    params: 'posts.get.params.req'
  })
  .delete('/:id', async ({ userId, params: { id } }) => {

    const post = await PostService.findById(id)

    if (userId !== post.authorId) {
      throw new UserIdConflictError('Error while deleting post.')
    }

    const data = await PostService.remove(id)

    return {
      data
    }
  }, {
    auth: true,
    params: 'posts.get.params.req'
  })