import type { FloorKind, OpeningKind, RoomKind, ScenePalette } from '../components/art/RoomScene'
import type { MaterialTexture } from '../components/art/MaterialSwatch'

export interface Swatch {
  name: string
  hex: string
}

export interface Material {
  name: string
  finish: string
  texture: MaterialTexture
  color: string
  use: string
}

export interface DesignConcept {
  slug: string
  number: string
  name: string
  style: string
  tagline: string
  summary: string
  description: string[]
  mood: string[]
  palette: Swatch[]
  materials: Material[]
  keyPieces: string[]
  suitedTo: string[]
  scene: ScenePalette
  rooms: RoomKind[]
  floor?: FloorKind
  opening?: OpeningKind
  seed: number
}

/**
 * Pre-designed interior collections. These are studio design directions a
 * client can request and have tailored to their space.
 */
export const concepts: DesignConcept[] = [
  {
    slug: 'quiet-ivory',
    number: '01',
    name: 'Quiet Ivory',
    style: 'Warm minimalism',
    tagline: 'Soft light, honest materials and nothing that shouts.',
    summary: 'A tonal, light-filled scheme of limewashed walls, pale oak and layered linen for homes that should feel like an exhale.',
    description: [
      'Quiet Ivory is built on restraint. Walls are washed in a warm, chalky ivory so daylight moves softly across them through the day. Floors run in wide, pale oak, and furniture sits low and generous, upholstered in heavy linen and bouclé.',
      'Colour is held to a narrow band of creams, oat and taupe, with a single bronze accent repeated through hardware, lighting and frames. The result is calm without being cold: a home that feels considered rather than decorated.',
    ],
    mood: ['Calm', 'Tonal', 'Tactile', 'Light-filled'],
    palette: [
      { name: 'Ivory limewash', hex: '#F2ECE2' },
      { name: 'Oat linen', hex: '#E3D8C8' },
      { name: 'Pale oak', hex: '#CDB497' },
      { name: 'Taupe', hex: '#A78B70' },
      { name: 'Espresso', hex: '#45382F' },
    ],
    materials: [
      { name: 'Limewash plaster', finish: 'Hand-brushed, matte', texture: 'plaster', color: '#EEE6DA', use: 'Walls and ceilings' },
      { name: 'European oak', finish: 'White oil, wide plank', texture: 'wood', color: '#D2BA9C', use: 'Flooring and joinery' },
      { name: 'Washed linen', finish: 'Heavyweight, stonewashed', texture: 'weave', color: '#E3D8C8', use: 'Upholstery and drapery' },
      { name: 'Bouclé', finish: 'Wool blend', texture: 'boucle', color: '#EFE8DD', use: 'Lounge seating' },
      { name: 'Brushed bronze', finish: 'Living finish', texture: 'metal', color: '#8A6A4A', use: 'Hardware and lighting' },
    ],
    keyPieces: ['Low, deep-seated sofa in linen', 'Travertine drum coffee table', 'Arc floor lamp in bronze', 'Sheer floor-to-ceiling drapery'],
    suitedTo: ['Living spaces', 'Bedrooms', 'Apartments'],
    scene: { wall: '#EFE8DD', floor: '#D2BA9C', wood: '#A3815F', fabric: '#E6DCCD', accent: '#A78B70', dark: '#45382F', stone: '#D8CEC0', sky: '#C9D2CF', plant: '#7D8466' },
    rooms: ['living', 'bedroom', 'dining', 'vignette'],
    opening: 'arch',
    seed: 11,
  },
  {
    slug: 'bronze-nocturne',
    number: '02',
    name: 'Bronze Nocturne',
    style: 'Dark modern luxury',
    tagline: 'Enveloping, low-lit and quietly dramatic.',
    summary: 'Smoked oak, deep espresso walls and burnished bronze, composed for evening: intimate living rooms, private suites and lounges.',
    description: [
      'Bronze Nocturne wraps a room in depth. Walls and joinery are taken into deep espresso and smoked oak, so the architecture recedes and light becomes the material. Lighting is low and layered: picture lights, concealed coves and warm pools from table lamps.',
      'Surfaces are rich but controlled: honed dark stone, fluted timber, aged bronze and velvet in tobacco tones. It is a scheme for rooms used at night, where the mood matters as much as the furniture.',
    ],
    mood: ['Intimate', 'Dramatic', 'Rich', 'Evening'],
    palette: [
      { name: 'Smoked espresso', hex: '#3B302A' },
      { name: 'Tobacco velvet', hex: '#6B5240' },
      { name: 'Aged bronze', hex: '#8A6A4A' },
      { name: 'Taupe', hex: '#A78B70' },
      { name: 'Warm beige', hex: '#E9DFD1' },
    ],
    materials: [
      { name: 'Smoked oak', finish: 'Fumed, fluted', texture: 'wood', color: '#5B473A', use: 'Wall panelling and joinery' },
      { name: 'Nero marquina', finish: 'Honed', texture: 'marble', color: '#3E3631', use: 'Tables and bar tops' },
      { name: 'Cotton velvet', finish: 'Deep pile', texture: 'weave', color: '#6B5240', use: 'Lounge seating' },
      { name: 'Aged bronze', finish: 'Hand-patinated', texture: 'metal', color: '#7E5F42', use: 'Lighting and trims' },
      { name: 'Saddle leather', finish: 'Aniline', texture: 'leather', color: '#7A5640', use: 'Accent chairs and pulls' },
    ],
    keyPieces: ['Fluted smoked-oak wall panelling', 'Velvet lounge chairs', 'Honed dark stone coffee table', 'Concealed cove lighting'],
    suitedTo: ['Living spaces', 'Hospitality lounges', 'Principal suites'],
    scene: { wall: '#5C4B3F', floor: '#6E5644', wood: '#4A3A2F', fabric: '#8B6B55', accent: '#B08A5E', dark: '#2B231E', stone: '#4C433D', sky: '#9DA6A6', plant: '#5F6A50' },
    rooms: ['living', 'lobby', 'bedroom', 'vignette'],
    floor: 'oak',
    opening: 'arch',
    seed: 23,
  },
  {
    slug: 'atelier-japandi',
    number: '03',
    name: 'Atelier Japandi',
    style: 'Japanese–Scandinavian',
    tagline: 'Pared-back craft with room to breathe.',
    summary: 'Pale ash, paper-soft light and hand-thrown ceramics: a disciplined, crafted calm for homes and quiet workspaces.',
    description: [
      'Atelier Japandi borrows the discipline of Japanese interiors and the warmth of Scandinavian craft. Rooms are edited hard, with storage built in so surfaces stay clear. Timber slats filter light and screen views without closing a space down.',
      'Furniture is low, crafted and visibly made: joinery you can read, ceramics with the maker’s mark, linen with a slub. The palette sits between pale ash, rice-paper white and soft charcoal, grounded with moss green.',
    ],
    mood: ['Crafted', 'Serene', 'Ordered', 'Natural'],
    palette: [
      { name: 'Rice paper', hex: '#F1ECE3' },
      { name: 'Pale ash', hex: '#D9C7AC' },
      { name: 'Moss', hex: '#7C8167' },
      { name: 'Sumi charcoal', hex: '#4A4440' },
      { name: 'Clay', hex: '#B79C82' },
    ],
    materials: [
      { name: 'Ash timber', finish: 'Natural oil', texture: 'wood', color: '#D9C7AC', use: 'Slatted screens and joinery' },
      { name: 'Washi-effect plaster', finish: 'Fine, matte', texture: 'plaster', color: '#EFE9DF', use: 'Walls' },
      { name: 'Slub linen', finish: 'Natural', texture: 'weave', color: '#DCD2C3', use: 'Upholstery and blinds' },
      { name: 'Woven cane', finish: 'Natural', texture: 'cane', color: '#CDB68F', use: 'Cabinet fronts and chairs' },
      { name: 'Charcoal stoneware', finish: 'Glazed', texture: 'stone', color: '#5A534D', use: 'Basins and objects' },
    ],
    keyPieces: ['Slatted ash room divider', 'Low platform bed', 'Cane-front sideboard', 'Paper pendant lights'],
    suitedTo: ['Bedrooms', 'Bathrooms', 'Studios and offices'],
    scene: { wall: '#F0EBE2', floor: '#D9C7AC', wood: '#BFA27F', fabric: '#DCD2C3', accent: '#7C8167', dark: '#4A4440', stone: '#CFC6B8', sky: '#C8D0C8', plant: '#6E765A' },
    rooms: ['bedroom', 'bath', 'office', 'dining'],
    opening: 'slats',
    seed: 37,
  },
  {
    slug: 'riviera-limestone',
    number: '04',
    name: 'Riviera Limestone',
    style: 'Modern Mediterranean',
    tagline: 'Sun-washed stone, arches and slow afternoons.',
    summary: 'Travertine, limewash and olive wood under soft arches: a relaxed, sunlit scheme for family homes, kitchens and holiday residences.',
    description: [
      'Riviera Limestone takes its cue from coastal houses built to stay cool. Arched openings soften circulation, floors are laid in honed limestone and walls are finished in a sun-bleached limewash that changes tone through the day.',
      'Kitchens and dining rooms are the heart of the scheme, with solid travertine islands, olive-wood boards and terracotta accents. Fabrics are loose and natural, made for living rather than looking.',
    ],
    mood: ['Sunlit', 'Relaxed', 'Sculptural', 'Earthy'],
    palette: [
      { name: 'Limewash', hex: '#EFE6D8' },
      { name: 'Travertine', hex: '#D8C5AA' },
      { name: 'Olive', hex: '#7F7A55' },
      { name: 'Terracotta', hex: '#B7835E' },
      { name: 'Driftwood', hex: '#8E7660' },
    ],
    materials: [
      { name: 'Travertine', finish: 'Honed, filled', texture: 'stone', color: '#D8C5AA', use: 'Floors, islands and vanities' },
      { name: 'Limewash', finish: 'Cloudy, matte', texture: 'plaster', color: '#EFE6D8', use: 'Walls and arches' },
      { name: 'Olive wood', finish: 'Oiled', texture: 'wood', color: '#A68A66', use: 'Tables and boards' },
      { name: 'Terracotta', finish: 'Handmade tile', texture: 'terrazzo', color: '#C0906A', use: 'Splashbacks and terraces' },
      { name: 'Raw linen', finish: 'Loose weave', texture: 'weave', color: '#E4D9C6', use: 'Curtains and slipcovers' },
    ],
    keyPieces: ['Solid travertine island', 'Arched openings and niches', 'Olive-wood dining table', 'Linen slipcovered seating'],
    suitedTo: ['Kitchens', 'Dining rooms', 'Family homes'],
    scene: { wall: '#EFE5D6', floor: '#D8C5AA', wood: '#A68A66', fabric: '#E6DAC7', accent: '#B7835E', dark: '#4D3F33', stone: '#DCCBB2', sky: '#C3D2D6', plant: '#7F7A55' },
    rooms: ['kitchen', 'dining', 'living', 'bath'],
    floor: 'stone',
    opening: 'arch',
    seed: 41,
  },
  {
    slug: 'heritage-modern',
    number: '05',
    name: 'Heritage Modern',
    style: 'Contemporary classic',
    tagline: 'Classical proportion, edited for today.',
    summary: 'Panelled walls, walnut, veined marble and fine brass detailing: tailored, timeless rooms with a sense of permanence.',
    description: [
      'Heritage Modern respects classical proportion: panelled walls, considered cornicing and symmetrical layouts. Then it edits. Ornament is simplified, the palette is softened to greige and stone, and contemporary furniture sits comfortably within the frame.',
      'Walnut joinery, veined marble and slim brass details bring a tailored precision. It suits period properties being renovated and new builds that want the gravity of an older house.',
    ],
    mood: ['Tailored', 'Timeless', 'Composed', 'Refined'],
    palette: [
      { name: 'Greige', hex: '#E2D9CC' },
      { name: 'Calacatta', hex: '#EEEAE4' },
      { name: 'Walnut', hex: '#6E5240' },
      { name: 'Brass', hex: '#A88958' },
      { name: 'Ink', hex: '#3E3732' },
    ],
    materials: [
      { name: 'Calacatta marble', finish: 'Honed', texture: 'marble', color: '#EEEAE4', use: 'Fireplaces and bathrooms' },
      { name: 'American walnut', finish: 'Satin lacquer', texture: 'wood', color: '#6E5240', use: 'Joinery and doors' },
      { name: 'Painted panelling', finish: 'Eggshell', texture: 'plaster', color: '#E2D9CC', use: 'Walls' },
      { name: 'Satin brass', finish: 'Lacquered', texture: 'metal', color: '#A88958', use: 'Ironmongery and lighting' },
      { name: 'Wool flannel', finish: 'Fine', texture: 'weave', color: '#BDB2A4', use: 'Upholstery' },
    ],
    keyPieces: ['Full-height wall panelling', 'Walnut library joinery', 'Marble fire surround', 'Linear brass pendant'],
    suitedTo: ['Period renovations', 'Dining rooms', 'Studies and libraries'],
    scene: { wall: '#E4DBCE', floor: '#B89B7C', wood: '#6E5240', fabric: '#CFC5B7', accent: '#A88958', dark: '#3E3732', stone: '#EAE5DE', sky: '#C7CFD1', plant: '#717A60' },
    rooms: ['dining', 'living', 'office', 'vignette'],
    opening: 'window',
    seed: 53,
  },
  {
    slug: 'terra-organic',
    number: '06',
    name: 'Terra Organic',
    style: 'Organic modern',
    tagline: 'Earth tones, soft curves and natural texture.',
    summary: 'Clay plaster, rattan, rust-toned textiles and curved silhouettes for warm, grounded homes that invite you to sit down.',
    description: [
      'Terra Organic is warm and deliberately imperfect. Walls are finished in clay plaster with visible movement, furniture curves rather than corners, and texture does the work that pattern usually would.',
      'Rust, sand and ochre textiles are layered over natural rattan and solid timber. It is a scheme that ages well, getting better as it is lived in.',
    ],
    mood: ['Warm', 'Grounded', 'Curved', 'Textural'],
    palette: [
      { name: 'Sand', hex: '#E6D6C0' },
      { name: 'Clay', hex: '#C49A78' },
      { name: 'Rust', hex: '#9C5F3F' },
      { name: 'Ochre', hex: '#B98E52' },
      { name: 'Bark', hex: '#5A4535' },
    ],
    materials: [
      { name: 'Clay plaster', finish: 'Trowelled', texture: 'plaster', color: '#D9BFA3', use: 'Feature walls' },
      { name: 'Rattan', finish: 'Natural', texture: 'cane', color: '#C7A574', use: 'Chairs and lighting' },
      { name: 'Wool bouclé', finish: 'Chunky loop', texture: 'boucle', color: '#E6D6C0', use: 'Curved sofas' },
      { name: 'Solid elm', finish: 'Hard wax oil', texture: 'wood', color: '#A07B58', use: 'Tables and benches' },
      { name: 'Rust linen', finish: 'Garment-dyed', texture: 'weave', color: '#9C5F3F', use: 'Cushions and throws' },
    ],
    keyPieces: ['Curved bouclé sofa', 'Rattan pendant lights', 'Clay-plaster feature wall', 'Live-edge elm table'],
    suitedTo: ['Living spaces', 'Family homes', 'Wellness spaces'],
    scene: { wall: '#E8D8C3', floor: '#C7A886', wood: '#946F50', fabric: '#E3D1BA', accent: '#9C5F3F', dark: '#4C3A2D', stone: '#D4BFA6', sky: '#D2CDBF', plant: '#76784F' },
    rooms: ['living', 'dining', 'bedroom', 'vignette'],
    opening: 'arch',
    seed: 67,
  },
  {
    slug: 'gallery-loft',
    number: '07',
    name: 'Gallery Loft',
    style: 'Refined industrial',
    tagline: 'Volume, steel and walls made for art.',
    summary: 'Polished concrete, blackened steel glazing and walnut for open-plan lofts and creative workplaces that need to work hard and look composed.',
    description: [
      'Gallery Loft is designed for volume. Polished concrete floors and steel-framed glazing give an industrial clarity, while walnut, leather and wool bring the warmth back in. Walls are kept clean and lit for art.',
      'In workplaces, the scheme zones open floors with joinery and glazing rather than walls, so teams keep their light and sightlines.',
    ],
    mood: ['Open', 'Confident', 'Architectural', 'Gallery-lit'],
    palette: [
      { name: 'Gallery white', hex: '#EEEBE5' },
      { name: 'Concrete', hex: '#BDB6AC' },
      { name: 'Walnut', hex: '#6B5141' },
      { name: 'Blackened steel', hex: '#3A3633' },
      { name: 'Cognac', hex: '#9A6B48' },
    ],
    materials: [
      { name: 'Polished concrete', finish: 'Sealed, satin', texture: 'stone', color: '#BDB6AC', use: 'Floors' },
      { name: 'Blackened steel', finish: 'Waxed', texture: 'metal', color: '#3A3633', use: 'Glazing and shelving' },
      { name: 'Walnut', finish: 'Oiled', texture: 'wood', color: '#6B5141', use: 'Tables and joinery' },
      { name: 'Cognac leather', finish: 'Vegetable-tanned', texture: 'leather', color: '#9A6B48', use: 'Seating' },
      { name: 'Felted wool', finish: 'Acoustic', texture: 'weave', color: '#8F877D', use: 'Acoustic panels' },
    ],
    keyPieces: ['Steel-framed internal glazing', 'Long walnut work table', 'Leather lounge seating', 'Track gallery lighting'],
    suitedTo: ['Offices', 'Lofts', 'Creative studios'],
    scene: { wall: '#ECE8E1', floor: '#BDB6AC', wood: '#6B5141', fabric: '#9A6B48', accent: '#9A6B48', dark: '#3A3633', stone: '#C9C3BA', sky: '#C3CBCF', plant: '#68705A' },
    rooms: ['office', 'kitchen', 'living', 'lobby'],
    floor: 'concrete',
    opening: 'grid',
    seed: 79,
  },
  {
    slug: 'salon-particulier',
    number: '08',
    name: 'Salon Particulier',
    style: 'Boutique hospitality',
    tagline: 'The intimacy of a private house, the polish of a hotel.',
    summary: 'Fluted plaster, smoked mirror, olive velvet and brass for boutique hotels, restaurants and residences that host.',
    description: [
      'Salon Particulier is a hospitality scheme with domestic warmth. Arrival is staged: a sculpted reception, a soft-lit lounge, then quieter rooms beyond. Fluted plaster and terrazzo give durability without losing elegance.',
      'Deep olive velvet, smoked mirror and polished brass catch the light in the evening, while durable contract-grade finishes keep it looking as good on day one thousand as on opening night.',
    ],
    mood: ['Hosted', 'Polished', 'Atmospheric', 'Durable'],
    palette: [
      { name: 'Plaster', hex: '#EDE4D7' },
      { name: 'Olive velvet', hex: '#6F6B4C' },
      { name: 'Polished brass', hex: '#B08D57' },
      { name: 'Terrazzo', hex: '#D9CDBD' },
      { name: 'Espresso', hex: '#45382F' },
    ],
    materials: [
      { name: 'Terrazzo', finish: 'Polished, contract grade', texture: 'terrazzo', color: '#DCD0C0', use: 'Floors and reception desk' },
      { name: 'Fluted plaster', finish: 'Polished', texture: 'plaster', color: '#EDE4D7', use: 'Feature walls' },
      { name: 'Mohair velvet', finish: 'Contract grade', texture: 'weave', color: '#6F6B4C', use: 'Banquettes and lounge chairs' },
      { name: 'Polished brass', finish: 'Lacquered', texture: 'metal', color: '#B08D57', use: 'Lighting, rails and trims' },
      { name: 'Smoked oak', finish: 'Matte lacquer', texture: 'wood', color: '#6A5444', use: 'Joinery and bar fronts' },
    ],
    keyPieces: ['Sculpted terrazzo reception desk', 'Halo pendant over arrival', 'Velvet lounge pairs', 'Smoked-mirror bar back'],
    suitedTo: ['Hotels', 'Restaurants and bars', 'Commercial receptions'],
    scene: { wall: '#EAE0D2', floor: '#D9CDBD', wood: '#6A5444', fabric: '#6F6B4C', accent: '#B08D57', dark: '#3C322B', stone: '#E3D8CA', sky: '#C9CFC8', plant: '#6F6B4C' },
    rooms: ['lobby', 'dining', 'bath', 'living'],
    floor: 'terrazzo',
    opening: 'arch',
    seed: 97,
  },
]

export const conceptBySlug = (slug: string | undefined) => concepts.find((c) => c.slug === slug)
