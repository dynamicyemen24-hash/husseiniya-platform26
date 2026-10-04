import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: [
      "server/**/*.test.ts",
      "server/**/*.spec.ts",
      "client/src/**/*.test.ts",
      "client/src/**/*.spec.ts",
    ],
    // Container-backed integration suites have their own config + runner
    // (`vitest.integration.config.ts` via `pnpm test:integration`, with a
    // dedicated CI job). Excluding them here keeps `pnpm test` a pure unit
    // run that stays green on machines without a container runtime.
    exclude: ["server/**/*.integration.test.ts"],
    // Load .env so the DB-backed integration tests (guarded by
    // `!process.env.DATABASE_URL`) actually execute against the live database.
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["server/**/*.ts", "client/src/**/*.ts"],
      exclude: [
        "server/**/*.test.ts",
        "server/**/*.spec.ts",
        "client/src/**/*.test.ts",
        "client/src/**/*.spec.ts",
        "server/_core/index.ts",
        "server/serverless/**",
        "client/src/main.tsx",
        "client/src/components/ui/**",
      ],
      thresholds: {
        // Incremental raise from 35% (2026-09-12 baseline) to 50% target.
        // Branches 70% -> 75%, Functions 30% -> 45%.
        statements: 50,
        branches: 75,
        functions: 45,
        lines: 50,
      },
    },
  },
});
