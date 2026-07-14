import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["assests/tvk.jfif"],
      manifest: {
        name: "குறை தீர்க்கும் பயண்பாடு",
        short_name: "குறை தீர்வு",
        description: "மக்கள் குறைகளை பதிவு செய்து அதன் நிலையை அறியும் செயலி.",
        lang: "ta",
        start_url: "/",
        display: "standalone",
        background_color: "#f7faf7",
        theme_color: "#9f0100",
        icons: [
          {
            src: "/assests/tvk.jfif",
            sizes: "any",
            type: "image/jfif",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // Ensure HTML is not precached; Vite will emit a fresh index.html on each build
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});