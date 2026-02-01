import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const hmrHost = process.env.VITE_HMR_HOST || process.env.HMR_HOST;
const hmrPort = toNumber(process.env.VITE_HMR_PORT || process.env.HMR_PORT);
const hmrClientPort = toNumber(
  process.env.VITE_HMR_CLIENT_PORT || process.env.HMR_CLIENT_PORT,
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allows opening dev server from phone on same Wi‑Fi (use http://<your-pc-ip>:5173)
    host: true,
    port: 5173,
    strictPort: true,

    // HMR uses a WebSocket. Some setups (VPN/WSL/proxy/phone) need explicit host/port.
    // If you still see "failed to connect to websocket", set e.g.:
    //   VITE_HMR_HOST=192.168.1.10
    //   VITE_HMR_CLIENT_PORT=5173
    ...(hmrHost || hmrPort || hmrClientPort
      ? {
          hmr: {
            protocol: "ws",
            host: hmrHost,
            port: hmrPort,
            clientPort: hmrClientPort,
          },
        }
      : {}),

    headers: {
      // Helps OAuth popup flows (Google) avoid COOP postMessage warnings.
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
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
