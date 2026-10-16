import { db } from "./client";
import { roles } from "./schema";

const ROLES = ["admin", "moderator", "user"];

await db
  .insert(roles)
  .values(ROLES.map((name) => ({ name })))
  .onConflictDoNothing({ target: roles.name });

console.log("Roles seeded");
process.exit(0);
