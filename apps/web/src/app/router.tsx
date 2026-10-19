import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, createRouter, Outlet, redirect } from "@tanstack/react-router";
import { LoginPage, RegisterPage } from "../features/auth";
import { SessionSkeleton } from "../features/auth/components/SessionSkeleton";
import { sessionQuery } from "../features/auth/session";
import { DashboardPage } from "../features/dashboard";
import { queryClient } from "./query";

export type RouterContext = { queryClient: QueryClient };

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

const requireSession = async ({ context }: { context: RouterContext }) => {
  const user = await context.queryClient.ensureQueryData(sessionQuery);
  if (!user) throw redirect({ to: "/login" });
};

const requireAnonymous = async ({ context }: { context: RouterContext }) => {
  const user = await context.queryClient.ensureQueryData(sessionQuery);
  if (user) throw redirect({ to: "/" });
};

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: requireSession,
  component: DashboardPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: requireAnonymous,
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: requireAnonymous,
  component: RegisterPage,
});

const routeTree = rootRoute.addChildren([dashboardRoute, loginRoute, registerRoute]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  // The SPA owns every page under one prefix, so the API keeps only "/app" and the client router
  // owns the URL scheme.
  basepath: "/app",
  defaultPreload: "intent",
  defaultPendingComponent: SessionSkeleton,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
