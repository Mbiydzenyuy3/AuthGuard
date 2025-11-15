import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import turboPlugin from "eslint-plugin-turbo";
import onlyWarn from "eslint-plugin-only-warn";

/** @type {import("eslint").Linter.FlatConfig[]} */
export const config = [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module"
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      turbo: turboPlugin,
      "only-warn": onlyWarn
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn"
    },
    ignores: ["dist/**", "node_modules/**"]
  }
];

