import { Elysia, t } from 'elysia';

export const commentModels = new Elysia({ name: 'models.comments' })
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
    }),
    'comments.get.query.req': t.Object({
      id: t.Number()
    })
  })