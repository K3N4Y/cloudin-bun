import { app } from "./app";

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3001),
  fetch: app.fetch,
});

console.log(`api listening on ${server.url}`);
