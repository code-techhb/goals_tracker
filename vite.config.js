import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["buffer"],
  },
  resolve: {
    alias: {
      buffer: "buffer/",
    },
  },
  define: {
    global: {},
    "process.env": {},
  },
});
