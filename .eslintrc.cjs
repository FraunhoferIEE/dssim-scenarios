module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    './node_modules/gts/',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
};
