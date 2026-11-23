import type { RoomKind } from '../components/art/RoomScene'

export interface Service {
  slug: string
  number: string
  title: string
  summary: string
  includes: string[]
  room: RoomKind
  conceptSlug: string
}

export const services: Service[] = [
  {
    slug: 'residential',
    number: '01',
    title: 'Residential Interiors',
    summary: 'Whole-home design for apartments, townhouses and family residences, from first layout to the last cushion.',
    includes: ['Concept and mood direction', 'Layouts and joinery design', 'Furniture, lighting and art sourcing', 'Installation and styling'],
    room: 'living',
    conceptSlug: 'quiet-ivory',
  },
  {
    slug: 'commercial',
    number: '02',
    title: 'Commercial & Workplace',
    summary: 'Offices, showrooms and clinics designed around how teams work and how clients should feel on arrival.',
    includes: ['Workplace strategy and zoning', 'Brand-led interior concepts', 'Acoustic and lighting design', 'Contractor coordination'],
    room: 'office',
    conceptSlug: 'gallery-loft',
  },
  {
    slug: 'hospitality',
    number: '03',
    title: 'Hospitality',
    summary: 'Boutique hotels, restaurants and lounges with atmosphere, durability and operational sense built in.',
    includes: ['Guest-journey planning', 'Contract-grade specification', 'Bespoke furniture design', 'FF&E procurement'],
    room: 'lobby',
    conceptSlug: 'salon-particulier',
  },
  {
    slug: 'kitchens',
    number: '04',
    title: 'Kitchen Design',
    summary: 'Kitchens that cook as well as they look: workflow, storage and stone, resolved to the millimetre.',
    includes: ['Workflow and appliance planning', 'Bespoke cabinetry design', 'Stone and surface selection', 'Lighting and ventilation'],
    room: 'kitchen',
    conceptSlug: 'riviera-limestone',
  },
  {
    slug: 'bedrooms',
    number: '05',
    title: 'Bedrooms & Suites',
    summary: 'Restful principal suites, guest rooms and dressing rooms with layered light and generous storage.',
    includes: ['Suite layouts and wardrobes', 'Headboard and joinery design', 'Soft furnishings and bedding', 'Lighting scenes'],
    room: 'bedroom',
    conceptSlug: 'atelier-japandi',
  },
  {
    slug: 'living-spaces',
    number: '06',
    title: 'Living Spaces',
    summary: 'Living, dining and family rooms composed for both everyday comfort and the evenings you host.',
    includes: ['Furniture layouts', 'Media and storage joinery', 'Art and object curation', 'Window treatments'],
    room: 'dining',
    conceptSlug: 'heritage-modern',
  },
  {
    slug: 'renovation',
    number: '07',
    title: 'Renovation',
    summary: 'Sensitive renovation of existing homes and commercial spaces, managed from survey to handover.',
    includes: ['Measured survey and condition review', 'Design and specification', 'Contractor tender support', 'Site supervision'],
    room: 'bath',
    conceptSlug: 'terra-organic',
  },
  {
    slug: 'space-planning',
    number: '08',
    title: 'Space Planning',
    summary: 'Layouts that unlock square metres: circulation, zoning and furniture plans before a single wall moves.',
    includes: ['Existing-space analysis', 'Layout options and test fits', 'Furniture and lighting plans', 'Planning drawings for contractors'],
    room: 'vignette',
    conceptSlug: 'bronze-nocturne',
  },
]

export const processSteps = [
  { n: '01', title: 'Site visit', text: 'We walk the space with you, measure, photograph and listen to how you want to live or work in it.' },
  { n: '02', title: 'Concept', text: 'A design direction with layouts, moodboards, palette and materials, refined together until it is right.' },
  { n: '03', title: 'Design development', text: 'Detailed drawings, joinery, lighting and full specification, with a transparent budget.' },
  { n: '04', title: 'Delivery', text: 'We coordinate trades, procurement and installation, then style the finished space for handover.' },
]
