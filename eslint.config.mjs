import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 ships flat configs directly. Wrapping it in
 * FlatCompat (the pre-16 setup) crashes ESLint with a circular-JSON error.
 */
const config = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "node_modules/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      // Unused imports are worth fixing but shouldn't block a deploy.
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      // React Compiler rules new in Next 16. The existing code predates them;
      // clean these up over time rather than failing CI on every push.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
]);

export default config;
