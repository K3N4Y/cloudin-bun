import { Hono } from "hono";
import { problem, respond, type Problem } from "../../lib/errors";
import { requireAuth } from "../auth/auth.middleware";
import { createRepositorySchema } from "./repositories.schema";
import * as repositoriesService from "./repositories.service";
import type { CreateRepositoryFailure } from "./repositories.service";

const CREATE_REPOSITORY_ERRORS: Record<CreateRepositoryFailure, Problem> = {
    forbidden: problem(403, "forbidden", "Your role cannot create repositories in this namespace."),
    name_conflict: problem(409, "name_conflict", "A repository with that name already exists in this namespace."),
};

export const repositoriesRoutes = new Hono()
    .post("/repositories/prod", requireAuth, async (c) => {
        const parsed = createRepositorySchema.safeParse(await c.req.json().catch(() => null));
        if (!parsed.success) return respond(c, problem(422, "invalid_request", "Invalid request body."));

        const outcome = await repositoriesService.createRepository({
            actor: c.get("user"),
            namespace: "prod",
            name: parsed.data.name,
        });
        if (!outcome.ok) return respond(c, CREATE_REPOSITORY_ERRORS[outcome.reason]);

        return c.json({ repo: outcome.repo }, 201);
    });
