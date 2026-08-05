import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { yaml } from './plugins/yaml.ts'

const entry = (name: string) => fileURLToPath(new URL(name, import.meta.url))

// `BASE_PATH` lets one build serve from a domain root (Netlify, Vercel, a
// custom domain) or from a GitHub Pages project path such as
// /musical-waffle/. See README.
//
// Case studies are separate static HTML entries rather than client-side
// routes — the site has no router, and a plain multi-page build works
// unmodified on any static host (no rewrite rules needed, unlike an SPA).
// Add a new one by adding its .html file here.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), yaml()],
  build: {
    rollupOptions: {
      input: {
        main: entry('./index.html'),
        caseStudyVasant: entry('./case-study-vasant.html'),
      },
    },
  },
})
