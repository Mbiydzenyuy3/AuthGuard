import { config as reactConfig } from '@devguard/eslint-config/react-internal';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...reactConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['dist/**', 'node_modules/**'],
  },
];
