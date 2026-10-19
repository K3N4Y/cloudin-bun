import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";

const webDist = resolve(import.meta.dir, "../../../../web/dist");
const shellPath = resolve(webDist, "index.html");

/**
 * Resolves a request path under `web/dist`. Returns `null` for anything that escapes the root or
 * cannot name a file, because the SPA's public paths are attacker-controlled once the client router
 * owns URL scheme.
 */
export async function serveWebFile(relPath: string): Promise<Response | null> {
  // Bun.file throws on a NUL byte, which would turn an unauthenticated GET into a logged 500.
  if (relPath.includes("\u0000")) return null;

  const target = resolve(webDist, `.${relPath}`);
  if (!target.startsWith(webDist + sep)) return null;

  const file = Bun.file(target);
  if (!(await file.exists())) return null;
  return new Response(file);
}

export function serveWebShell(): Response {
  if (!existsSync(shellPath)) return new Response("Not Found", { status: 404 });
  return new Response(Bun.file(shellPath), { headers: { "cache-control": "no-store" } });
}
