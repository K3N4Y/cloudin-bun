import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import {
  parseRoleName,
  repositories,
  roles,
  type NewRepository,
  type Repository,
  type RoleName,
} from "../../db/schema";

export async function findRoleName(roleId: number): Promise<RoleName | null> {
  const row = await db.select({ name: roles.name }).from(roles).where(eq(roles.id, roleId)).get();
  return row ? parseRoleName(row.name) : null;
}

export type InsertRepositoryResult =
  | { ok: true; repo: Repository }
  | { ok: false; reason: "name_conflict" };

export async function insertRepository(values: NewRepository): Promise<InsertRepositoryResult> {
  const rows = await db
    .insert(repositories)
    .values(values)
    .onConflictDoNothing({ target: [repositories.namespace, repositories.name] })
    .returning();

  const row = rows[0];
  if (!row) return { ok: false, reason: "name_conflict" };
  return { ok: true, repo: row };
}
