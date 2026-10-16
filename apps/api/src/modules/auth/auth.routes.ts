import { Hono } from "hono";
import { problem, respond } from "../../lib/errors";
import { clearSessionCookie, readSessionToken, requireAuth, setSessionCookie } from "./auth.middleware";
import { loginSchema } from "./auth.schema";
import * as authService from "./auth.service";

export const authRoutes = new Hono()
    .post("/auth/login", async (c) => {
        const parsed = loginSchema.safeParse(await c.req.json().catch(() => null));
        if (!parsed.success) return respond(c, problem(400, "invalid_request", "Invalid request body."));

        const outcome = await authService.login(parsed.data);
        if (!outcome.ok) {
            return respond(c, problem(401, "invalid_credentials", "Invalid email or password."));
        }
        setSessionCookie(c, outcome.session);
        return c.json({ user: outcome.user });
    })
    .post("/auth/logout", async (c) => {
        await authService.logout(readSessionToken(c));
        clearSessionCookie(c);
        return c.body(null, 204);
    })
    .get("/auth/me", requireAuth, (c) => c.json({ user: c.get("user") }));
