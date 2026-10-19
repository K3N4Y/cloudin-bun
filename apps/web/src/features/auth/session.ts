import { queryOptions, useQuery } from "@tanstack/react-query";
import { ApiError, apiRequest } from "../../lib/api";
import { parseUser, type PublicUser } from "./types";

/** `GET /auth/me`, where a 401 is the endpoint's answer ("anonymous") rather than a failure. The
 *  translation lives here and not in `apiRequest`, which stays policy-free for other callers. */
async function fetchMe(): Promise<PublicUser | null> {
  try {
    return parseUser(await apiRequest({ method: "GET", path: "/auth/me" }));
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export const sessionQuery = queryOptions({
  queryKey: ["auth", "me"],
  queryFn: fetchMe,
  // The cookie is the only source of session truth, so a cached answer is never allowed to outlive
  // it: every navigation revalidates, and a revoked or expired session is noticed on focus.
  staleTime: 0,
  refetchOnWindowFocus: true,
  retry: false,
});

export function useSession(): { status: "unknown" | "anonymous" | "authed"; user: PublicUser | null } {
  const { data, isPending } = useQuery(sessionQuery);
  if (isPending) return { status: "unknown", user: null };
  if (!data) return { status: "anonymous", user: null };
  return { status: "authed", user: data };
}
