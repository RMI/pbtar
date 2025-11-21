import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    pool: "threads",
    setupFiles: ["./src/test/setup.ts", "./src/test/failOnReactWarnings.ts"],
    restoreMocks: true,
  },
});
