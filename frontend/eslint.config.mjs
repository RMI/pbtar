import eslint from 'eslint';
import reactPlugin from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Add Prettier last to disable conflicting rules
  prettierConfig,
];