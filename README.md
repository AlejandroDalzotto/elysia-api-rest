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

- `PORT`: the port where the server will be running.
- `JWT_SECRET`: the secret to sign the JWT tokens.
- `NODE_ENV`: the environment where the server is running. By default is 'development'.
- `DB_NAME`: the name of the database.
- `DB_USER`: the user to connect to the database. By default is 'postgres'.
- `DB_PASSWORD`: the password to connect to the database.
- `DB_HOST`: the host where the database is running. By default is 'localhost'.
- `DB_PORT`: the port where the database is running. By default is '5432'.

## Documentation

Once the server is up, you can see the documentation provided by swagger by navigating to `/api/docs`.
