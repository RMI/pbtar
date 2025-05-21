import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
  },
  build: {
    // Output directory - this is already the default
    outDir: 'dist',
    // Generate assets with content hashes for better caching
    assetsDir: 'assets',
    // Add source maps for debugging if needed
    sourcemap: false,
    // Pre-optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: './src/test/setup.js'
  }
});
