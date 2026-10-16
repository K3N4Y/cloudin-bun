import type { Context, MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { isProduction } from "../../env";
import { problem, respond } from "../../lib/errors";
import { parseSessionToken, type IssuedSession } from "./auth.schema";
import * as authService from "./auth.service";

const SESSION_COOKIE = "sed";

export function readSessionToken(c: Context): string | null {
  const raw = getCookie(c, SESSION_COOKIE);
  return raw ? parseSessionToken(raw) : null;
}

export function setSessionCookie(c: Context, session: IssuedSession): void {
  setCookie(c, SESSION_COOKIE, session.token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Lax",
    path: "/",
    maxAge: Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000)),
  });
}

export function clearSessionCookie(c: Context): void {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const token = readSessionToken(c);
  if (!token) return respond(c, problem(401, "unauthenticated", "Authentication required."));

  const outcome = await authService.authenticate(token);
  if (!outcome.ok) return respond(c, problem(401, "unauthenticated", "Authentication required."));

  if (outcome.refresh) setSessionCookie(c, { token, expiresAt: outcome.refresh.expiresAt });
  c.set("user", outcome.user);
  await next();
};
