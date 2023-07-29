/** @type {import('eslint').Linter.BaseConfig} */
const conf = {
  reportUnusedDisableDirectives: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
  ],
  plugins: ['@typescript-eslint'],
  // https://github.com/typescript-eslint/typescript-eslint/blob/6c3816b3831e6e683c1a7842196b34248803d69b/packages/eslint-plugin/docs/rules/explicit-function-return-type.md#configuring-in-a-mixed-jsts-codebase
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' },
    ],

    // disabled globally, because it's not possible to satisfy these rules in js files (even with jsdoc comments)
    // These are enabled specifically for TS in `overrides` below.
    // TS may still complain about implicit any, etc in js code.
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',

    // Types created with `type` keyword can expand inline to become unreadable.
    // Empty interfaces solve this problem - type hover boxes instead show the interface name,
    // Instead of expanding full type inline.
    '@typescript-eslint/no-empty-interface': 'off',
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': [
          'error',
        ],
        '@typescript-eslint/explicit-module-boundary-types': [
          'error',
        ],
        '@typescript-eslint/no-var-requires': ['error'],
      },
    },
  ],
}

module.exports = conf
