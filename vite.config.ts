import path from 'node:path'
import babel from '@rolldown/plugin-babel'
import inject from '@rollup/plugin-inject'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true, // Vite 8 原生支持，替代 vite-tsconfig-paths
    alias: {
      '@': path.resolve(__dirname, './src'),
      'buffer': 'buffer',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9999', // 仅保留基础地址
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api\//, '/'),
        ws: true,
      },
    },
  },
  build: {
    rolldownOptions: {
      plugins: [
        inject({
          Buffer: ['buffer', 'Buffer'],
          process: 'process',
        }),
      ],
    },
  },
})
