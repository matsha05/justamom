import { configDefaults, defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
    exclude: [...configDefaults.exclude, "tests/smoke/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd()),
    },
  },
});
