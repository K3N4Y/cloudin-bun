import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

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
