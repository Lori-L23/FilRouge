import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import laravel from 'laravel-vite-plugin';

// laravel({
// input: 'resources/js/App.jsx',
// refresh: true,
// })
// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 3000,
    hmr: { host: "localhost" },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
    },
  },
});
