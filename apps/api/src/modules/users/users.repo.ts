import { db } from "../../db/client";
import { users } from "../../db/schema";
import type { CreateUserInput, PublicUser } from "./users.schema";

export async function createUser(input: CreateUserInput): Promise<PublicUser> {
  const passwordHash = await Bun.password.hash(input.password);

  const rows = await db
    .insert(users)
    .values({ email: input.email, username: input.username, passwordHash })
    .returning();

  const row = rows[0];
  if (!row) {
    throw new Error("createUser: insert returned no row");
  }

  const { passwordHash: _passwordHash, ...publicUser } = row;
  return publicUser;
}
