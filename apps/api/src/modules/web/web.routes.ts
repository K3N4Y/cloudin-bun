import { Hono } from "hono";
import { serveWebFile, serveWebShell } from "./web.service";

export const webRoutes = new Hono()
    .get("/", (c) => c.redirect("/app"))
    .get("/app", () => serveWebShell())
    .get("/app/*", async (c) => {
        const rel = c.req.path.slice("/app".length);

        const file = await serveWebFile(rel);
        if (file) return file;

        if (rel.startsWith("/assets/")) return c.notFound();

        return serveWebShell();
    });
