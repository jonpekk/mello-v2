import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import reactRefresh from 'eslint-plugin-react-refresh';

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    ignores: ["build/**", "dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  globalIgnores(["build/**/*", "server/dist/**/*", "server/prisma/**/*", "client/dist/**"]),
]);