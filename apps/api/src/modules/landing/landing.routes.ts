import { resolve } from "node:path";
import { serveStatic } from "@hono/bun";
import { Hono } from "hono";

const landingDist = resolve(import.meta.dir, "../../../../landing/dist");

export const landingRoutes = new Hono()
    .get("*", serveStatic({ root: landingDist }));
