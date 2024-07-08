import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Insieme 2024",
        short_name: "Insieme",
        theme_color: "#83dcd0",
        background_color: "linear-gradient(to bottom, rgb(131, 220, 208), rgb(71, 161, 151))", 
        icons: [
          {
            src: "./public/pwa/favicon-32x32.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "./public/pwa/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./public/pwa/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "./public/pwa/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
