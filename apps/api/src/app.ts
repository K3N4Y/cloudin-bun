import { Hono } from "hono";
import { healthzRoutes } from "./modules/healthz/healthz.routes";
import { landingRoutes } from "./modules/landing/landing.routes";

export const app = new Hono()
    .route("/", healthzRoutes)
    .route("/", landingRoutes);
