import { resolve } from "node:path";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./client";

migrate(db, { migrationsFolder: resolve(import.meta.dir, "migrations") });

console.log("db: migrations applied");
