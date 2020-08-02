module.exports = {
  env: {
    browser: true,
    es2020: true,
    webextensions: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'prettier',
    'prettier/flowtype', // if you are using flow
    'prettier/react',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['flowtype', 'react', 'jsx-a11y', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'react/prop-types': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};