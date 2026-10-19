import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const api = "http://localhost:3001";

export default defineConfig({
  // Absolute, not relative: a relative base resolves asset URLs against the request path, so the
  // bare `/app` URL would ask for `/assets/...` and get the shell back instead of the bundle.
  base: "/app/",
  plugins: [react(), tailwindcss()],
  server: {
    // The sed cookie is httpOnly and SameSite=Lax, so the API has to look same-origin in dev too.
    proxy: {
      "/auth": api,
      "/users": api,
      "/healthz": api,
    },
  },
});
