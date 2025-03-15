import { Elysia } from 'elysia';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { commentModels } from '@/models/comment';
import { CommentService } from '@/services/comment.service';
import { UserIdConflictError } from '@/exceptions/useridconflict.error';

export const commentsRoutes = new Elysia({ prefix: '/comments' })
  .use(authMiddleware)
  .use(commentModels)
  .get('/:id', async ({ params: { id: postId } }) => {

    const posts = await CommentService.findAll(postId)

    return {
      data: posts
    }
  }, {
    params: 'comments.get.query.req'
  })
  .put('/', async ({ body, userId }) => {
    const { authorId, body: content, postId } = body

    if (userId !== authorId) {
      throw new UserIdConflictError('Error while creating comment.')
    }

    const commentCreated = await CommentService.create(content, postId, authorId)

    return {
      data: commentCreated
    }
  }, {
    auth: true,
    body: 'comments.create.body.req'
  })
  .patch('/like', async ({ params: { id }, userId }) => {

    await CommentService.updateLikes(id, userId)

  }, {
    auth: true,
    params: 'comments.get.query.req'
  })