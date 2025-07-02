import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: globals.browser
    },
    extends: [js.configs.recommended],
    rules: {
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'prefer-const': 'error',
      'quotes': ['error', 'single'],
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      'curly': 'error',
      'space-before-function-paren': ['error', 'never'],
      'padding-line-between-statements': [
        'error',
        { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
        { 'blankLine': 'always', 'prev': ['const', 'let', 'var'], 'next': '*' },
        { 'blankLine': 'any', 'prev': ['const', 'let', 'var'], 'next': ['const', 'let', 'var'] }
      ]
    }
  }
]);
