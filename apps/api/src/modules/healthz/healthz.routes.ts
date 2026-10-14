import { Hono } from "hono";
import * as healthzService from "./healthz.service";

export const healthzRoutes = new Hono()
    .get("/healthz", (c) => c.json(healthzService.getHealth()));
