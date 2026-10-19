import type { AuthDraft, AuthMode, FieldName } from "./types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mirrors the server's bounds: `users.createUserSchema` (email shape, username 3-32, password 8+)
 * and `auth.loginSchema` (password 1+). The server stays authoritative, so these are only a hint
 * shown before a request is spent.
 */
export function validate(mode: AuthMode, draft: AuthDraft): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};

  if (!EMAIL.test(draft.email.trim())) errors.email = "Enter a valid email address.";

  if (mode === "register") {
    const username = draft.username.trim();
    if (username.length < 3 || username.length > 32) {
      errors.username = "Username must be 3 to 32 characters.";
    }
    if (draft.password.length < 8) errors.password = "Password must be at least 8 characters.";
  } else if (draft.password.length < 1) {
    errors.password = "Enter your password.";
  }

  return errors;
}
