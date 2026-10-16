import type { Context } from "hono";

export type ErrorStatus = 400 | 401 | 403 | 404 | 409 | 500;
export type Problem = { status: ErrorStatus; body: { error: { code: string; message: string } } };

export function problem(status: ErrorStatus, code: string, message: string): Problem {
  return { status, body: { error: { code, message } } };
}

export function respond(c: Context, p: Problem): Response {
  return c.json(p.body, p.status);
}
