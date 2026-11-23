import type { RoomKind } from '../components/art/RoomScene'

/**
 * SAMPLE PROJECTS — illustrative case studies that show how the portfolio
 * will present real work. Replace with the studio's completed projects and
 * photography. They intentionally name no real clients or addresses.
 */
export interface Project {
  slug: string
  title: string
  category: 'Residential' | 'Commercial' | 'Hospitality'
  type: string
  year: string
  area: string
  scope: string
  conceptSlug: string
  rooms: RoomKind[]
  brief: string
}

export const projects: Project[] = [
  {
    slug: 'linden-residence',
    title: 'The Linden Residence',
    category: 'Residential',
    type: 'Family home, full interior',
    year: 'Sample',
    area: '420 m²',
    scope: 'Full interior design, joinery, furnishing',
    conceptSlug: 'quiet-ivory',
    rooms: ['living', 'bedroom', 'dining'],
    brief: 'A light, tonal family home with generous built-in storage so living spaces stay calm.',
  },
  {
    slug: 'atelier-nine',
    title: 'Atelier Nine Offices',
    category: 'Commercial',
    type: 'Creative workplace',
    year: 'Sample',
    area: '650 m²',
    scope: 'Workplace strategy, fit-out design',
    conceptSlug: 'gallery-loft',
    rooms: ['office', 'kitchen', 'lobby'],
    brief: 'An open studio zoned with steel glazing and walnut joinery rather than walls.',
  },
  {
    slug: 'maison-clare',
    title: 'Maison Clare',
    category: 'Hospitality',
    type: 'Boutique hotel, 24 keys',
    year: 'Sample',
    area: '1,800 m²',
    scope: 'Lobby, lounge, restaurant and guest rooms',
    conceptSlug: 'salon-particulier',
    rooms: ['lobby', 'dining', 'bath'],
    brief: 'A hotel that feels like a private house, with terrazzo, velvet and soft brass throughout.',
  },
  {
    slug: 'olive-court',
    title: 'Olive Court Kitchen',
    category: 'Residential',
    type: 'Kitchen and dining renovation',
    year: 'Sample',
    area: '85 m²',
    scope: 'Renovation, kitchen design, lighting',
    conceptSlug: 'riviera-limestone',
    rooms: ['kitchen', 'dining', 'living'],
    brief: 'A dark, divided ground floor opened into one sunlit kitchen around a travertine island.',
  },
  {
    slug: 'harlow-suite',
    title: 'The Harlow Suite',
    category: 'Residential',
    type: 'Principal suite',
    year: 'Sample',
    area: '70 m²',
    scope: 'Bedroom, dressing room and bathroom',
    conceptSlug: 'atelier-japandi',
    rooms: ['bedroom', 'bath', 'vignette'],
    brief: 'A restful suite of ash, linen and stone, with every object given space.',
  },
  {
    slug: 'nocturne-lounge',
    title: 'Nocturne Lounge',
    category: 'Hospitality',
    type: 'Members’ lounge',
    year: 'Sample',
    area: '240 m²',
    scope: 'Concept, lighting, bespoke furniture',
    conceptSlug: 'bronze-nocturne',
    rooms: ['living', 'lobby', 'vignette'],
    brief: 'A low-lit evening lounge of smoked oak, velvet and bronze.',
  },
]
