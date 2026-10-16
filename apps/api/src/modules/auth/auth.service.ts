import type { PublicUser } from "../users/users.schema";
import { getPublicUser, verifyCredentials } from "../users/users.service";
import {
  newSessionToken,
  SESSION_POLICY,
  type IssuedSession,
  type LoginInput,
  type SessionLifetime,
} from "./auth.schema";
import * as authRepo from "./auth.repo";

export type LoginOutcome =
  | { ok: true; session: IssuedSession; user: PublicUser }
  | { ok: false; reason: "invalid_credentials" };

export type AuthOutcome =
  | { ok: true; user: PublicUser; refresh: { expiresAt: number } | null }
  | { ok: false; reason: "unauthenticated" };

export function isLive(s: SessionLifetime, now: number): boolean {
  return now < s.expiresAt && now < s.createdAt + SESSION_POLICY.absoluteMaxMs;
}

export function shouldRefresh(s: SessionLifetime, now: number): boolean {
  const cap = s.createdAt + SESSION_POLICY.absoluteMaxMs;
  if (s.expiresAt >= cap) return false;
  const lastTouched = s.expiresAt - SESSION_POLICY.ttlMs;
  return now - lastTouched >= SESSION_POLICY.touchEveryMs;
}

export function nextExpiry(s: SessionLifetime, now: number): number {
  return Math.min(now + SESSION_POLICY.ttlMs, s.createdAt + SESSION_POLICY.absoluteMaxMs);
}

export async function login(input: LoginInput, now = Date.now()): Promise<LoginOutcome> {
  const user = await verifyCredentials(input.email, input.password);
  if (!user) return { ok: false, reason: "invalid_credentials" };
  const token = newSessionToken();
  const expiresAt = now + SESSION_POLICY.ttlMs;
  await authRepo.createSession({ id: token, userId: user.id, createdAt: now, expiresAt });
  return { ok: true, session: { token, expiresAt }, user };
}

export async function logout(token: string | null): Promise<void> {
  if (!token) return;
  await authRepo.deleteSession(token);
}

export async function authenticate(token: string, now = Date.now()): Promise<AuthOutcome> {
  const session = await authRepo.findSession(token);
  if (!session) return { ok: false, reason: "unauthenticated" };
  if (!isLive(session, now)) {
    await authRepo.deleteSession(token);
    return { ok: false, reason: "unauthenticated" };
  }
  const user = await getPublicUser(session.userId);
  if (!user) {
    await authRepo.deleteSession(token);
    return { ok: false, reason: "unauthenticated" };
  }
  if (!shouldRefresh(session, now)) return { ok: true, user, refresh: null };
  const expiresAt = nextExpiry(session, now);
  await authRepo.touchSession(token, expiresAt);
  return { ok: true, user, refresh: { expiresAt } };
}
