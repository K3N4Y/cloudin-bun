import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { roles, users, type User } from "../../db/schema";
import { toPublicUser, type CreateUserInput, type PublicUser } from "./users.schema";

export async function createUser(input: CreateUserInput): Promise<PublicUser> {
  const passwordHash = await Bun.password.hash(input.password);

  const userRole = await db.select().from(roles).where(eq(roles.name, "user")).get();
  if (!userRole) {
    throw new Error('createUser: missing the "user" role (run db:seed)');
  }

  const rows = await db
    .insert(users)
    .values({ email: input.email, username: input.username, passwordHash, roleId: userRole.id })
    .returning();

  const row = rows[0];
  if (!row) {
    throw new Error("createUser: insert returned no row");
  }

  return toPublicUser(row);
}

export async function findByEmail(email: string): Promise<User | undefined> {
  return db.select().from(users).where(eq(users.email, email)).get();
}

export async function findById(id: number): Promise<User | undefined> {
  return db.select().from(users).where(eq(users.id, id)).get();
}
