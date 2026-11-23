import { site } from '../config/site'

/** Returns a wa.me deep link, or null when no studio number is configured. */
export function whatsappLink(message: string): string | null {
  const n = site.contact.whatsapp?.replace(/\D/g, '')
  if (!n) return null
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`
}

export const whatsappMessages = {
  general: 'Hello ISOE Interiors, I would like to talk about an interior design project.',
  siteVisit: 'Hello ISOE Interiors, I would like to book a site visit.',
  design: (name: string) => `Hello ISOE Interiors, I am interested in the ${name} design concept.`,
}
