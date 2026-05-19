import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    target: 'es2018',  // Target Chrome 109 (Windows 7 compatibility)
    minify: 'terser',
    sourcemap: true,   // Enable source maps for debugging on Windows 7
  },
  esbuild: {
    supported: {
      bigint: false,  // Disable BigInt if not needed
    },
  },
});
