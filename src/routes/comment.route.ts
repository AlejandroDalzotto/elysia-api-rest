import { authMiddleware } from '@/middlewares/auth.middleware';
import { CommentService } from '@/services/comment.service';
import Elysia, { t } from 'elysia';

const commentModels = new Elysia({ name: 'models.comments' })
  .model({
    'comments.create.body.req': t.Object({
      postId: t.Number(),
      body: t.String(),
      authorId: t.String()
    }),
    'comments.update.body.req': t.Object({
      title: t.Optional(t.String()),
      body: t.Optional(t.String()),
      authorId: t.String()
    })
  })

export const commentsRoutes = new Elysia({ prefix: '/comments' })
  .use(authMiddleware)
  .use(commentModels)
  .get('/:postId', async ({ params: { postId } }) => {

    const posts = await CommentService.findAll(postId)

    return {
      data: posts
    }
  }, {
    params: t.Object({
      postId: t.Number()
    })
  })
  .put('/', async ({ body, userId, error }) => {
    const { authorId, body: content, postId } = body

    if (userId !== authorId) {
      return error(403, 'Users cannot create comments on behalf of anothers.')
    }

    const commentCreated = await CommentService.create(content, postId, authorId)

    return {
      data: commentCreated
    }
  }, {
    auth: true,
    body: 'comments.create.body.req'
  })
  .patch('/like/:id', async ({ params: { id }, userId }) => {

    await CommentService.updateLikes(id, userId, true)

  }, {
    auth: true,
    params: t.Object({
      id: t.Number()
    })
  })
  .patch('/dislike/:id', async ({ params: { id }, userId }) => {

    await CommentService.updateLikes(id, userId, false)

  }, {
    auth: true,
    params: t.Object({
      id: t.Number()
    })
  })