import type { MaterialTexture } from '../components/art/MaterialSwatch'
import type { RoomKind } from '../components/art/RoomScene'

export type MoodItem =
  | { id: string; kind: 'colour'; label: string; hex: string }
  | { id: string; kind: 'material'; label: string; texture: MaterialTexture; color: string }
  | { id: string; kind: 'scene'; label: string; room: RoomKind; conceptSlug: string }

export const moodLibrary: { group: string; items: MoodItem[] }[] = [
  {
    group: 'Colour',
    items: [
      { id: 'c-ivory', kind: 'colour', label: 'Ivory', hex: '#F8F6F1' },
      { id: 'c-beige', kind: 'colour', label: 'Warm beige', hex: '#E9DFD1' },
      { id: 'c-taupe', kind: 'colour', label: 'Taupe', hex: '#A78B70' },
      { id: 'c-espresso', kind: 'colour', label: 'Espresso', hex: '#45382F' },
      { id: 'c-olive', kind: 'colour', label: 'Olive', hex: '#7F7A55' },
      { id: 'c-terracotta', kind: 'colour', label: 'Terracotta', hex: '#B7835E' },
      { id: 'c-moss', kind: 'colour', label: 'Moss', hex: '#7C8167' },
      { id: 'c-ink', kind: 'colour', label: 'Ink', hex: '#3E3732' },
    ],
  },
  {
    group: 'Materials',
    items: [
      { id: 'm-travertine', kind: 'material', label: 'Travertine', texture: 'stone', color: '#D8C5AA' },
      { id: 'm-calacatta', kind: 'material', label: 'Calacatta marble', texture: 'marble', color: '#EEEAE4' },
      { id: 'm-oak', kind: 'material', label: 'Pale oak', texture: 'wood', color: '#D2BA9C' },
      { id: 'm-walnut', kind: 'material', label: 'Walnut', texture: 'wood', color: '#6E5240' },
      { id: 'm-linen', kind: 'material', label: 'Linen', texture: 'weave', color: '#E3D8C8' },
      { id: 'm-boucle', kind: 'material', label: 'Bouclé', texture: 'boucle', color: '#EFE8DD' },
      { id: 'm-bronze', kind: 'material', label: 'Brushed bronze', texture: 'metal', color: '#8A6A4A' },
      { id: 'm-plaster', kind: 'material', label: 'Clay plaster', texture: 'plaster', color: '#D9BFA3' },
      { id: 'm-terrazzo', kind: 'material', label: 'Terrazzo', texture: 'terrazzo', color: '#DCD0C0' },
      { id: 'm-cane', kind: 'material', label: 'Cane', texture: 'cane', color: '#CDB68F' },
      { id: 'm-leather', kind: 'material', label: 'Cognac leather', texture: 'leather', color: '#9A6B48' },
      { id: 'm-velvet', kind: 'material', label: 'Olive velvet', texture: 'weave', color: '#6F6B4C' },
    ],
  },
  {
    group: 'Spaces',
    items: [
      { id: 's-living', kind: 'scene', label: 'Tonal living', room: 'living', conceptSlug: 'quiet-ivory' },
      { id: 's-kitchen', kind: 'scene', label: 'Stone kitchen', room: 'kitchen', conceptSlug: 'riviera-limestone' },
      { id: 's-bedroom', kind: 'scene', label: 'Calm bedroom', room: 'bedroom', conceptSlug: 'atelier-japandi' },
      { id: 's-lounge', kind: 'scene', label: 'Evening lounge', room: 'living', conceptSlug: 'bronze-nocturne' },
      { id: 's-dining', kind: 'scene', label: 'Panelled dining', room: 'dining', conceptSlug: 'heritage-modern' },
      { id: 's-bath', kind: 'scene', label: 'Stone bathroom', room: 'bath', conceptSlug: 'salon-particulier' },
    ],
  },
]

export const allMoodItems = moodLibrary.flatMap((g) => g.items)
