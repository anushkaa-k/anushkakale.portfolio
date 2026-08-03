import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { yaml } from './plugins/yaml.ts'

// `BASE_PATH` lets one build serve from a domain root (Netlify, Vercel, a
// custom domain) or from a GitHub Pages project path such as
// /musical-waffle/. See README.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), yaml()],
})
