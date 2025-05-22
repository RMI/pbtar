import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';

export default [
  // Base recommended ESLint rules
  js.configs.recommended,
  
  // React configuration
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      globals: {
        console: true,
        document: true,
        window: true,
        navigator: true,

        // Timer functions
        setTimeout: true,
        clearTimeout: true,

        // Network APIs
        fetch: true,
        Request: true,
        Response: true
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      // React specific rules
      ...reactPlugin.configs.recommended.rules,
      // Turn off rules that are too strict
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
