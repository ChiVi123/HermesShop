import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: { ...globals.node } } },
  { files: ['**/*.{js,mjs,cjs,ts}'], plugins: { js }, extends: ['js/recommended'] },
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      indent: ['warn', 2],
      semi: [1, 'always'],
    },
    ignores: ['**/node_modules/**/*', 'build/**/*'],
  },
]);
