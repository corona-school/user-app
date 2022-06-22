module.exports = {
  root: true,
  plugins: ['react-hooks'],
  extends: ['react-app'],
  rules: {
    'no-extra-semi': ['warn'],
    'comma-dangle': ['off'],
    'no-shadow': ['off'],
    semi: 'off',
    'eol-last': ['off'],
    'no-use-before-define': 'off',
    'react-native/no-inline-styles': ['off'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-expressions': 'off'
  }
}
