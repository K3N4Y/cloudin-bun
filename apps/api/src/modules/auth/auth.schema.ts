import { randomBytes } from "node:crypto";
import { z } from "zod";
import { emailSchema, type PublicUser } from "../users/users.schema";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const SESSION_POLICY = {
  ttlMs: 1000 * 60 * 60 * 24 * 7,
  absoluteMaxMs: 1000 * 60 * 60 * 24 * 30,
  touchEveryMs: 1000 * 60 * 60,
} as const;

export function newSessionToken(): string {
  return randomBytes(32).toString("hex");
}

const TOKEN_RE = /^[0-9a-f]{64}$/;

export function parseSessionToken(raw: string): string | null {
  return TOKEN_RE.test(raw) ? raw : null;
}

export type SessionLifetime = { createdAt: number; expiresAt: number };
export type SessionRecord = SessionLifetime & { id: string; userId: number };
export type IssuedSession = { token: string; expiresAt: number };

declare module "hono" {
  interface ContextVariableMap {
    user: PublicUser;
  }
}
