import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([".next", "node_modules"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaVersion: "latest", ecmaFeatures: { jsx: true }, sourceType: "module" },
    },
    rules: { "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }] },
  },
]);
