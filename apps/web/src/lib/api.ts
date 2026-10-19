export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Request = { method: "GET" | "POST"; path: string; body?: unknown };

function readError(payload: unknown): { code: string; message: string } {
  const fallback = { code: "unknown", message: "Request failed." };
  if (typeof payload !== "object" || payload === null || !("error" in payload)) return fallback;

  const { error } = payload;
  if (typeof error !== "object" || error === null) return fallback;

  const code = "code" in error && typeof error.code === "string" ? error.code : fallback.code;
  const message = "message" in error && typeof error.message === "string" ? error.message : fallback.message;
  return { code, message };
}

/**
 * Root-relative JSON request. Paths carry no host because the API is same-origin in both dev (the
 * Vite proxy) and production (the API serves this app), which is what keeps the httpOnly session
 * cookie out of cross-origin rules. Returns `unknown` so callers parse into a domain type.
 */
export async function apiRequest({ method, path, body }: Request): Promise<unknown> {
  const response = await fetch(path, {
    method,
    credentials: "include",
    headers: body === undefined ? {} : { "content-type": "application/json" },
    body: body === undefined ? null : JSON.stringify(body),
  });

  const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const { code, message } = readError(payload);
    throw new ApiError(response.status, code, message);
  }
  return payload;
}
