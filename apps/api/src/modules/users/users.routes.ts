import { Hono } from "hono";
import { problem, respond, type Problem } from "../../lib/errors";
import { createUserSchema } from "./users.schema";
import * as usersService from "./users.service";

type CreateUserFailure = Extract<usersService.CreateUserOutcome, { ok: false }>["reason"];

const CREATE_USER_ERRORS: Record<CreateUserFailure, Problem> = {
    email_taken: problem(409, "email_taken", "That email is already registered."),
    username_taken: problem(409, "username_taken", "That username is taken."),
};

export const usersRoutes = new Hono()
    .post("/users", async (c) => {
        const parsed = createUserSchema.safeParse(await c.req.json().catch(() => null));
        if (!parsed.success) return respond(c, problem(400, "invalid_request", "Invalid request body."));

        const outcome = await usersService.createUser(parsed.data);
        if (!outcome.ok) return respond(c, CREATE_USER_ERRORS[outcome.reason]);

        return c.json({ user: outcome.user }, 201);
    });
