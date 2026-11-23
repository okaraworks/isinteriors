/**
 * Budget estimator inputs.
 *
 * IMPORTANT: The per-square-metre rates below are INDICATIVE PLACEHOLDERS so
 * the tool works end to end. Replace them with the studio's own rates for its
 * market before going live. Currency is set in config/site.ts.
 */
export const projectTypes = [
  { id: 'residential', label: 'Residential', factor: 1 },
  { id: 'commercial', label: 'Commercial / Office', factor: 0.9 },
  { id: 'hospitality', label: 'Hospitality', factor: 1.25 },
  { id: 'kitchen', label: 'Kitchen', factor: 1.6 },
  { id: 'bedroom', label: 'Bedroom suite', factor: 0.95 },
] as const

export const scopes = [
  { id: 'styling', label: 'Furnish & style', note: 'Furniture, lighting, soft furnishings and art in an existing shell.', rate: 260 },
  { id: 'refresh', label: 'Refresh', note: 'Decoration, lighting, joinery updates and furnishing.', rate: 520 },
  { id: 'renovation', label: 'Full renovation', note: 'New layouts, services, finishes, joinery and furnishing.', rate: 1100 },
] as const

export const finishes = [
  { id: 'signature', label: 'Signature', note: 'Considered, quality finishes', factor: 1 },
  { id: 'premium', label: 'Premium', note: 'Natural stone, bespoke joinery', factor: 1.45 },
  { id: 'bespoke', label: 'Bespoke', note: 'Commissioned, one-off pieces', factor: 2.1 },
] as const

/** Design fee as a share of the build/furnishing budget (placeholder). */
export const designFeeShare = { low: 0.1, high: 0.15 }
/** ± range shown around the midpoint estimate. */
export const rangeSpread = 0.18

export const SQFT_PER_SQM = 10.7639
