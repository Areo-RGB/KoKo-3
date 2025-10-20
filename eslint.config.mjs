import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsProject = path.join(__dirname, "tsconfig.json");
const tsFilePatterns = ["**/*.ts", "**/*.tsx", "**/*.cts", "**/*.mts"];

const nextCoreWebVitalsRules = {
  ...nextPlugin.configs.recommended.rules,
  ...nextPlugin.configs["core-web-vitals"].rules,
};

export default defineConfig([
  {
    ignores: ["**/.next/**", "**/out/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: config.files ?? tsFilePatterns,
  })),
  {
    files: tsFilePatterns,
    languageOptions: {
      parserOptions: {
        project: tsProject,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      next: {
        rootDir: ["./"],
      },
    },
    rules: {
      ...nextCoreWebVitalsRules,
      "@next/next/no-html-link-for-pages": "error",
      "react/jsx-key": "error",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-sync-scripts": "off",
      "@next/next/no-title-in-document-head": "off",
      "react/prop-types": "off",
      "react/display-name": "off",
      "object-shorthand": "warn",
      "prefer-template": "off",
      "prefer-arrow-callback": "off",
      "prefer-const": "error",
      "no-empty": [
        "error",
        {
          allowEmptyCatch: true,
        },
      ],
    },
  },
  {
    files: [
      "components/**/*.{ts,tsx}",
      "app/**/_components/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "fs",
              message: "fs is Node.js only - cannot be used in client components",
            },
            {
              name: "fs/promises",
              message:
                "fs/promises is Node.js only - cannot be used in client components",
            },
            {
              name: "path",
              message: "path is Node.js only - cannot be used in client components",
            },
            {
              name: "child_process",
              message:
                "child_process is Node.js only - cannot be used in client components",
            },
            {
              name: "os",
              message: "os is Node.js only - cannot be used in client components",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);
