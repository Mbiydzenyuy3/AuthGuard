import js from '@eslint/js';
import { config as baseConfig } from './packages/eslint-config/base.js';

export default [
  js.configs.recommended,

  ...baseConfig,

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/build/**',
      '**/infra/cdk.out/**',
      '**/*.d.ts',
    ],
  },
];
