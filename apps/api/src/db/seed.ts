import { db } from "./client";
import { roles, ROLE_NAMES } from "./schema";

await db
  .insert(roles)
  .values(ROLE_NAMES.map((name) => ({ name })))
  .onConflictDoNothing({ target: roles.name });

console.log("Roles seeded");
process.exit(0);
