export type PublicUser = {
  id: number;
  email: string;
  username: string;
  createdAt: string;
  roleId: number;
};

export type AuthMode = "login" | "register";
export type FieldName = "email" | "username" | "password";
export type AuthDraft = Record<FieldName, string>;

export type SessionStatus = "unknown" | "anonymous" | "authed";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Reads the `{ user }` envelope both `POST /users` and `POST /auth/login` answer with, so no wire
 *  shape is visible past this function. */
export function parseUser(payload: unknown): PublicUser | null {
  if (!isRecord(payload) || !isRecord(payload.user)) return null;

  const { id, email, username, createdAt, roleId } = payload.user;
  if (typeof id !== "number" || typeof email !== "string" || typeof username !== "string") return null;
  if (typeof createdAt !== "string" || typeof roleId !== "number") return null;

  return { id, email, username, createdAt, roleId };
}
