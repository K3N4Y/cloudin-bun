import { ApiError } from "../../lib/api";
import type { PublicUser } from "./types";
import type { Feedback } from "./store";

/** `POST /users` succeeded and the follow-up login did not, so the account exists and no session
 *  does. Carrying the user lets the register page send the person to login instead of trapping them. */
export class SessionNotEstablishedError extends Error {
  constructor(readonly user: PublicUser) {
    super("account created, session not established");
    this.name = "SessionNotEstablishedError";
  }
}

const BY_CODE: Record<string, Feedback> = {
  email_taken: { field: "email", message: "That email is already registered. Log in instead." },
  username_taken: { field: "username", message: "That username is taken." },
  invalid_credentials: { field: null, message: "Invalid email or password." },
  invalid_request: { field: null, message: "Check the form and try again." },
};

const UNKNOWN: Feedback = { field: null, message: "Something went wrong. Please try again." };

export function interpretError(error: unknown): Feedback {
  return error instanceof ApiError ? (BY_CODE[error.code] ?? UNKNOWN) : UNKNOWN;
}
