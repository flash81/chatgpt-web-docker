module.exports = {
  root: true,
  extends: ['@antfu'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-console': 'off',
    'no-tabs': 'off',
    'sort-imports': ['error', {
      ignoreCase: false,
      ignoreDeclarationSort: true,
      ignoreMemberSort: true,
      memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'],
    }],
  },
}
