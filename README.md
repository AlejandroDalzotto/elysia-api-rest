# Elysia API REST

This is a small project to practice backend development with ElysiaJs as a replacement
for Express and Bun for Node.

## Getting started

First, you need to install [bun.js](https://bun.sh). If you already got it, you may proceed to install the dependencies with the
following command:

```shell
bun install
```

## Running the server

To run the server you have to run the following:

```shell
bun run dev
```

> [!NOTE]
> Notice that by default the app will the running at port 3000. You can change this behaviour by setting the PORT env variable.

## Database configuration

To connect to the database you have to set all the environment variables needed:

- `PORT`: type string, default '3000'.
- `JWT_SECRET`: type string, minimum length 16 characters.
- `NODE_ENV`: type enum 'development' or 'production', default 'development' .
- `DB_NAME`: type string.
- `DB_USER`: type string, default 'postgres'.
- `DB_PASSWORD`: type string.
- `DB_HOST`: type string, default 'localhost'.
- `DB_PORT`: type string, default '5432'.

## Documentation

Once the server is up, you can see the documentation provided by swagger by navigating to `/api/docs`.
