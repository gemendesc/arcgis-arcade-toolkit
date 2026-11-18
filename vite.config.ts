import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base './' permite deploy transparente tanto em subdomínio raiz (Vercel / arcade.georgemendes.net)
// quanto em subdiretório do GitHub Pages (/arcgis-arcade-toolkit/)
export default defineConfig({
  base: "./",
  plugins: [react()],
});
