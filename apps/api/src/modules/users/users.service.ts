import { toPublicUser, type PublicUser } from "./users.schema";
import * as usersRepo from "./users.repo";

// Verified against on a miss so an unknown email costs the same as a wrong password.
const DUMMY_PASSWORD_HASH = await Bun.password.hash("cloudin-timing-equalizer");

/** null for BOTH unknown email and wrong password, so the caller cannot leak existence. */
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
