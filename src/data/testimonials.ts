/**
 * Testimonials are intentionally empty. Add only genuine client words, with
 * the client's permission, e.g.
 *   { quote: '…', name: 'Client name', project: 'Project type, City' }
 * Until entries exist, the site shows a clearly marked placeholder.
 */
export interface Testimonial {
  quote: string
  name: string
  project: string
}

export const testimonials: Testimonial[] = []
