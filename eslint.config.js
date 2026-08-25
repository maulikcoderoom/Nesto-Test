// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const playwright = require('eslint-plugin-playwright');
const prettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    ignores: ['node_modules/**', 'test-results/**', 'playwright-report/**', 'playwright/.auth/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['tests/**/*.ts', 'src/**/*.ts', 'configs/**/*.ts'],
    plugins: { playwright },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Every test must assert something — no silent no-op tests.
      'playwright/expect-expect': 'error',
      // Tests must be independent; use fixtures/hooks instead of relying on run order.
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/prefer-web-first-assertions': 'error',
    },
  },
  prettier,
);
