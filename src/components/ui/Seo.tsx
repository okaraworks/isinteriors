import { site } from '../../config/site'

interface SeoProps {
  title?: string
  description?: string
  path?: string
  jsonLd?: Record<string, unknown>
  noindex?: boolean
}

/** React 19 hoists <title>, <meta> and <link> into <head> automatically. */
export function Seo({ title, description = site.description, path = '/', jsonLd, noindex }: SeoProps) {
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — Interior Architecture & Design Studio`
  const url = `${site.url}${path}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </>
  )
}

/** Organisation schema. Contact fields are added only when they are configured. */
export function studioJsonLd() {
  const c = site.contact
  return {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesigner',
    name: site.name,
    description: site.description,
    url: site.url,
    ...(c.phone ? { telephone: c.phone } : {}),
    ...(c.email ? { email: c.email } : {}),
    ...(c.address ? { address: c.address.join(', ') } : {}),
    knowsAbout: ['Residential interior design', 'Commercial interior design', 'Hospitality interior design', 'Kitchen design', 'Renovation', 'Space planning'],
  }
}
