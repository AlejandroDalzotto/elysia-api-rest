import { t, Elysia } from "elysia";

export const postModels = new Elysia({ name: 'models.posts' })
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
    ),
    'posts.get.params.req': t.Object({
      id: t.Number()
    })
  })