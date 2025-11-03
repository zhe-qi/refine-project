import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  ignores: ['src/components/ui/**'],
  rules: {
    'react-hooks/static-components': 'off',
  },
})
