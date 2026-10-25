import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
const proxy = { "/api": "http://127.0.0.1:3001" };
export default defineConfig({
  plugins: [tailwindcss()],
  server: { proxy },
  preview: { proxy },
});
