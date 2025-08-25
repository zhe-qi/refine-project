import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
}, {
  rules: {
    'eslint-comments/no-unlimited-disable': 'off',
  },
  ignores: [
    './src/api/admin',
    './src/api/public',
  ],
})
