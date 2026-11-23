import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` produces a normal, code-split production build (dist/).
// `npm run build:preview` produces one self-contained HTML file (dist-preview/)
// with hash routing, used for shareable offline previews.
/** Adds Google Search Console / Bing Webmaster verification tags to the static HTML. */
function siteVerification(env: Record<string, string>): Plugin {
  const esc = (s: string) => s.replace(/[^\w\-=+/]/g, '')
  return {
    name: 'site-verification',
    transformIndexHtml() {
      const tags = []
      if (env.VITE_GOOGLE_SITE_VERIFICATION) tags.push({ tag: 'meta', attrs: { name: 'google-site-verification', content: esc(env.VITE_GOOGLE_SITE_VERIFICATION) }, injectTo: 'head' as const })
      if (env.VITE_BING_SITE_VERIFICATION) tags.push({ tag: 'meta', attrs: { name: 'msvalidate.01', content: esc(env.VITE_BING_SITE_VERIFICATION) }, injectTo: 'head' as const })
      return tags
    },
  }
}

export default defineConfig(({ mode }) => {
  const singleFile = mode === 'preview-single'
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), siteVerification(env), ...(singleFile ? [viteSingleFile()] : [])],
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
