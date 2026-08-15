import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Served from https://<owner>.github.io/Incline-Insights/ on GitHub Pages,
  // so production assets need that subpath prefix; the dev server stays at "/".
  base: command === 'build' ? '/Incline-Insights/' : '/',
  plugins: [react()],
}))
