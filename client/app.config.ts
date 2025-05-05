import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
  server: {
    routeRules: {
      "/api/v1/": { proxy: { to: "http://localhost:5500/api/v1/" } },
    }
  },
})