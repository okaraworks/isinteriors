import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` produces a normal, code-split production build (dist/).
// `npm run build:preview` produces one self-contained HTML file (dist-preview/)
// with hash routing, used for shareable offline previews.
export default defineConfig(({ mode }) => {
  const singleFile = mode === 'preview-single'
  return {
    plugins: [react(), tailwindcss(), ...(singleFile ? [viteSingleFile()] : [])],
    build: singleFile
      ? { outDir: 'dist-preview', assetsInlineLimit: 100_000_000, chunkSizeWarningLimit: 5000 }
      : {
          outDir: 'dist',
          // Firebase modules are only loaded on demand (form submit, studio login, analytics consent).
          rollupOptions: {
            output: {
              manualChunks(id: string) {
                if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'motion'
                if (id.includes('node_modules/react')) return 'react'
              },
            },
          },
        },
  }
})
