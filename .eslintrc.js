module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  settings: {
    'import/resolver': {
      node: {},
      webpack: {},
    },
  },
  rules: {
    'react/jsx-filename-extension': 0,
    'react/function-component-definition': 0,
    'react/prop-types': 0,
    'no-underscore-dangle': 0,
    'no-alert': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'react-hooks/exhaustive-deps': 0,
  },
};
