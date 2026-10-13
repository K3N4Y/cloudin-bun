const server = Bun.serve({
  port: Number(process.env.PORT ?? 3001),
  routes: {
    "/health": () => Response.json({ ok: true }),
  },
});

console.log(`api listening on ${server.url}`);
