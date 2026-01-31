import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      // Frontend -> Backend
      // Example: fetch('/api/users/signup') => http://localhost:5600/api/users/signup
      "/api": {
        target: "http://localhost:5600",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
