import { Hono } from "hono";
import { problem, respond } from "./lib/errors";
import { healthzRoutes } from "./modules/healthz/healthz.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { repositoriesRoutes } from "./modules/repositories/repositories.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { webRoutes } from "./modules/web/web.routes";

export const app = new Hono()
    .onError((err, c) => {
        console.error(err);
        return respond(c, problem(500, "internal", "Internal server error."));
    })
    .route("/", healthzRoutes)
    .route("/", authRoutes)
    .route("/", usersRoutes)
    .route("/", repositoriesRoutes)
    .route("/", webRoutes);
