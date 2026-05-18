import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked, // Add type checking rules
    ],
    files: ["src/**/*.{ts,tsx}", "*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname, // or __dirname in CJS
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
  },
  {
    files: ["src/**/*.{tsx,jsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      // Instead of extending react-hooks' legacy preset, enable its rules explicitly:
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["scripts/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        projectService: false,
      },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      // relax strict rules that aren’t useful for one-off scripts
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
);
