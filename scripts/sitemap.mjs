// Writes dist/sitemap.xml and points robots.txt at it, using VITE_SITE_URL.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const env = Object.fromEntries(
  ['.env', '.env.production', '.env.local', '.env.production.local']
    .filter(existsSync)
    .flatMap((f) => readFileSync(f, 'utf8').split('\n'))
    .map((l) => l.match(/^\s*([\w]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]]),
)
const site = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://www.example.com').replace(/\/$/, '')
const slugs = [...readFileSync('src/data/concepts.ts', 'utf8').matchAll(/slug: '([a-z-]+)'/g)].map((m) => m[1])
const paths = ['/', '/designs', '/services', '/projects', '/book-a-site-visit', '/privacy', ...slugs.map((s) => `/designs/${s}`)]
const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
writeFileSync('dist/sitemap.xml', xml)
const robots = readFileSync('dist/robots.txt', 'utf8').replace(/Sitemap: .*/, `Sitemap: ${site}/sitemap.xml`)
writeFileSync('dist/robots.txt', robots)
console.log(`sitemap.xml: ${paths.length} URLs for ${site}`)
