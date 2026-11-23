/**
 * Studio details.
 *
 * Every value marked `null` is intentionally left empty: the studio has not
 * supplied it yet and it must not be invented. Components render a clearly
 * marked placeholder (or hide the feature) until a real value is set here.
 */
export const site = {
  name: 'ISOE Interiors',
  shortName: 'ISOE',
  monogram: 'I/I',
  tagline: 'Interior architecture & design studio',
  description:
    'ISOE Interiors is an interior architecture and design studio creating calm, crafted residential, commercial and hospitality spaces.',
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://isoeinteriors.web.app',

  contact: {
    /** e.g. '+234 800 000 0000' — PLACEHOLDER, supply real number */
    phone: (import.meta.env.VITE_STUDIO_PHONE as string | undefined) || null,
    /** e.g. 'studio@isoeinteriors.com' — PLACEHOLDER, supply real address */
    email: (import.meta.env.VITE_STUDIO_EMAIL as string | undefined) || null,
    /** International format, digits only, no '+' (e.g. '2348000000000') — PLACEHOLDER */
    whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || null,
    /** Studio address lines — PLACEHOLDER */
    address: null as string[] | null,
    /** Opening hours line — PLACEHOLDER */
    hours: null as string | null,
  },

  social: {
    /** Instagram handle without '@' — PLACEHOLDER */
    instagram: null as string | null,
    pinterest: null as string | null,
    linkedin: null as string | null,
  },

  /** Used by the budget estimator. Rates are indicative placeholders — see data/budget.ts. */
  currency: { code: 'USD', locale: 'en-US' },
} as const

export const PLACEHOLDER = {
  phone: 'Studio phone — to be added',
  email: 'Studio email — to be added',
  whatsapp: 'WhatsApp number — to be added',
  address: ['Studio address — to be added'],
  hours: 'Studio hours — to be added',
  instagram: 'isoeinteriors',
}

export const navigation = [
  { label: 'Designs', to: '/designs' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Studio', to: '/#studio' },
  { label: 'Tools', to: '/#tools' },
] as const
