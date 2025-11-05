import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  ignores: [
    'src/components/ui/**',
    'src/api/*.d.ts',
  ],
  rules: {
    'react-hooks/static-components': 'off',
  },
})
