import { resolve } from "node:path";
import { serveStatic } from "@hono/bun";

const landingDist = resolve(import.meta.dir, "../../../../landing/dist");

export const serveLanding = serveStatic({root: landingDist });