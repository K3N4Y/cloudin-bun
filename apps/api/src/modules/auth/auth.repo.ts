import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { sessions, type Session } from "../../db/schema";
import type { SessionRecord } from "./auth.schema";

function toRecord(row: Session): SessionRecord {
  return {
    id: row.id,
    userId: row.userId,
    createdAt: row.createdAt.getTime(),
    expiresAt: row.expiresAt.getTime(),
  };
}

export async function findSession(id: string): Promise<SessionRecord | null> {
  const row = await db.select().from(sessions).where(eq(sessions.id, id)).get();
  return row ? toRecord(row) : null;
}

export async function createSession(session: SessionRecord): Promise<void> {
  await db.insert(sessions).values({
    id: session.id,
    userId: session.userId,
    createdAt: new Date(session.createdAt),
    expiresAt: new Date(session.expiresAt),
  });
}

export async function touchSession(id: string, expiresAt: number): Promise<void> {
  await db.update(sessions).set({ expiresAt: new Date(expiresAt) }).where(eq(sessions.id, id));
}

export async function deleteSession(id: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, id));
}
