import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api/auth": { target: "http://localhost:4001", changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/auth/, "") },
      "/api/catalog": { target: "http://localhost:4002", changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/catalog/, "") },
    },
  },
});
