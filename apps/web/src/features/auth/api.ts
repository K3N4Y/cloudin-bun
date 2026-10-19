import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { apiRequest } from "../../lib/api";
import { SessionNotEstablishedError, interpretError } from "./errors";
import { sessionQuery } from "./session";
import { useAuthFormStore } from "./store";
import { parseUser, type PublicUser } from "./types";

export type Credentials = { email: string; password: string };
export type Registration = { email: string; username: string; password: string };

async function requestLogin(input: Credentials): Promise<PublicUser> {
  const user = parseUser(await apiRequest({ method: "POST", path: "/auth/login", body: input }));
  if (!user) throw new Error("login answered without a user.");
  return user;
}

async function requestCreateUser(input: Registration): Promise<PublicUser> {
  const user = parseUser(await apiRequest({ method: "POST", path: "/users", body: input }));
  if (!user) throw new Error("create user answered without a user.");
  return user;
}

async function requestLogout(): Promise<void> {
  await apiRequest({ method: "POST", path: "/auth/logout" });
}

/**
 * Two calls by design: `POST /users` owns creation, `POST /auth/login` owns sessions. A failure in
 * the second one cannot be rolled back, so it becomes its own error type and the caller gains a way
 * forward instead of a duplicate-email dead end on retry.
 */
async function register(input: Registration): Promise<PublicUser> {
  const user = await requestCreateUser(input);
  try {
    await requestLogin({ email: input.email, password: input.password });
  } catch {
    throw new SessionNotEstablishedError(user);
  }
  return user;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setFeedback = useAuthFormStore((state) => state.setFeedback);
  const reset = useAuthFormStore((state) => state.reset);

  return useMutation({
    mutationFn: requestLogin,
    // The response is the new value of the session query, so write it instead of re-asking the server.
    onSuccess: (user) => {
      reset();
      queryClient.setQueryData(sessionQuery.queryKey, user);
      void router.navigate({ to: "/" });
    },
    onError: (error) => setFeedback(interpretError(error)),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setFeedback = useAuthFormStore((state) => state.setFeedback);
  const handOffToLogin = useAuthFormStore((state) => state.handOffToLogin);
  const reset = useAuthFormStore((state) => state.reset);

  return useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      reset();
      queryClient.setQueryData(sessionQuery.queryKey, user);
      void router.navigate({ to: "/" });
    },
    onError: (error) => {
      if (error instanceof SessionNotEstablishedError) {
        handOffToLogin();
        setFeedback({ field: null, message: "Your account was created. Log in to continue." });
        void router.navigate({ to: "/login" });
        return;
      }
      setFeedback(interpretError(error));
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const reset = useAuthFormStore((state) => state.reset);

  return useMutation({
    mutationFn: requestLogout,
    // Without the reset the login form would come back holding the previous user's credentials,
    // because the store is a module singleton that outlives the route.
    onSuccess: () => {
      reset();
      queryClient.setQueryData(sessionQuery.queryKey, null);
      void router.navigate({ to: "/login" });
    },
  });
}
