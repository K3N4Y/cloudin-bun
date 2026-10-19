import { toPublicUser, type CreateUserInput, type PublicUser } from "./users.schema";
import * as usersRepo from "./users.repo";

const DUMMY_PASSWORD_HASH = await Bun.password.hash("cloudin-timing-equalizer");

export type CreateUserOutcome =
  | { ok: true; user: PublicUser }
  | { ok: false; reason: "email_taken" | "username_taken" };

export async function createUser(input: CreateUserInput): Promise<CreateUserOutcome> {
  if (await usersRepo.findByEmail(input.email)) return { ok: false, reason: "email_taken" };
  if (await usersRepo.findByUsername(input.username)) return { ok: false, reason: "username_taken" };

  try {
    return { ok: true, user: await usersRepo.createUser(input) };
  } catch (error) {
    // The lookups above are advisory: two concurrent requests can both pass them and only the
    // unique index arbitrates. Re-derive which field lost instead of reporting a duplicate as 500.
    if (await usersRepo.findByEmail(input.email)) return { ok: false, reason: "email_taken" };
    if (await usersRepo.findByUsername(input.username)) return { ok: false, reason: "username_taken" };
    throw error;
  }
}

export async function verifyCredentials(email: string, password: string): Promise<PublicUser | null> {
  const user = await usersRepo.findByEmail(email);
  const ok = await Bun.password.verify(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
  if (!user || !ok) return null;
  return toPublicUser(user);
}

export async function getPublicUser(id: number): Promise<PublicUser | null> {
  const user = await usersRepo.findById(id);
  return user ? toPublicUser(user) : null;
}
