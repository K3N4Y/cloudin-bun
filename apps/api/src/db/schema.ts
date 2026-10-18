import { index, integer, sqliteTable, text, uniqueIndex, type AnySQLiteColumn } from "drizzle-orm/sqlite-core";

export const NAMESPACE_NAMES = ["prod", "staging", "workspace", "agents"] as const;
export type NamespaceName = (typeof NAMESPACE_NAMES)[number];

export const ROLE_NAMES = ["admin", "moderator", "user"] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export function parseRoleName(raw: string): RoleName | null {
  return (ROLE_NAMES as readonly string[]).includes(raw) ? (raw as RoleName) : null;
}

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    username: text("username").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_username_unique").on(table.username),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = sqliteTable(
  "sessions",
  {
    // Opaque session token. Generate with a CSPRNG, never a sequential value.
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export const repositories = sqliteTable(
  "repositories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    namespace: text("namespace", { enum: NAMESPACE_NAMES }).notNull(),
    ownerId: integer("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    sourceRepoId: integer("source_repo_id").references((): AnySQLiteColumn => repositories.id, {
      onDelete: "restrict",
    }),
    parentWorkspaceId: integer("parent_workspace_id").references((): AnySQLiteColumn => repositories.id, {
      onDelete: "restrict",
    }),
    remote: text("remote"),
    defaultBranch: text("default_branch").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("repositories_namespace_name_unique").on(table.namespace, table.name)],
);

export type Repository = typeof repositories.$inferSelect;
export type NewRepository = typeof repositories.$inferInsert;
