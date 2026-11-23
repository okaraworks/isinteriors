/** Design style finder: each answer scores one or more concepts (by slug). */
export interface QuizOption {
  label: string
  hint: string
  scores: Record<string, number>
  swatch: string[]
}
export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

export const quiz: QuizQuestion[] = [
  {
    id: 'feel',
    question: 'How should the space feel when you walk in?',
    options: [
      { label: 'Calm and light', hint: 'An exhale after the day', scores: { 'quiet-ivory': 3, 'atelier-japandi': 2 }, swatch: ['#F2ECE2', '#E3D8C8', '#CDB497'] },
      { label: 'Rich and intimate', hint: 'Low light, deep colour', scores: { 'bronze-nocturne': 3, 'salon-particulier': 2 }, swatch: ['#3B302A', '#6B5240', '#8A6A4A'] },
      { label: 'Warm and sunlit', hint: 'Relaxed, made for long lunches', scores: { 'riviera-limestone': 3, 'terra-organic': 2 }, swatch: ['#EFE6D8', '#D8C5AA', '#B7835E'] },
      { label: 'Tailored and composed', hint: 'Everything in its place', scores: { 'heritage-modern': 3, 'gallery-loft': 1 }, swatch: ['#E2D9CC', '#6E5240', '#A88958'] },
    ],
  },
  {
    id: 'material',
    question: 'Which material would you most like to touch every day?',
    options: [
      { label: 'Pale oak and linen', hint: 'Soft and natural', scores: { 'quiet-ivory': 2, 'atelier-japandi': 2 }, swatch: ['#D2BA9C', '#E3D8C8'] },
      { label: 'Honed stone and plaster', hint: 'Cool, sculptural', scores: { 'riviera-limestone': 3, 'salon-particulier': 1 }, swatch: ['#D8C5AA', '#EFE6D8'] },
      { label: 'Walnut and brass', hint: 'Polished and precise', scores: { 'heritage-modern': 3, 'gallery-loft': 1 }, swatch: ['#6E5240', '#A88958'] },
      { label: 'Velvet and bronze', hint: 'Deep and glamorous', scores: { 'bronze-nocturne': 2, 'salon-particulier': 2 }, swatch: ['#6F6B4C', '#8A6A4A'] },
      { label: 'Clay, rattan and bouclé', hint: 'Textural and earthy', scores: { 'terra-organic': 3 }, swatch: ['#C49A78', '#C7A574'] },
      { label: 'Concrete and steel', hint: 'Raw and architectural', scores: { 'gallery-loft': 3 }, swatch: ['#BDB6AC', '#3A3633'] },
    ],
  },
  {
    id: 'shape',
    question: 'Which shapes draw you in?',
    options: [
      { label: 'Soft curves and arches', hint: 'Rounded, organic forms', scores: { 'terra-organic': 2, 'riviera-limestone': 2, 'quiet-ivory': 1 }, swatch: ['#E6D6C0'] },
      { label: 'Clean, low lines', hint: 'Horizontal and grounded', scores: { 'atelier-japandi': 2, 'quiet-ivory': 2 }, swatch: ['#F1ECE3'] },
      { label: 'Classical symmetry', hint: 'Panels, frames, proportion', scores: { 'heritage-modern': 3 }, swatch: ['#E2D9CC'] },
      { label: 'Bold, graphic forms', hint: 'Steel, grids, volume', scores: { 'gallery-loft': 2, 'bronze-nocturne': 1 }, swatch: ['#3A3633'] },
    ],
  },
  {
    id: 'evening',
    question: 'What does a perfect evening at home look like?',
    options: [
      { label: 'Reading in a quiet corner', hint: 'Alone, unhurried', scores: { 'atelier-japandi': 2, 'quiet-ivory': 1 }, swatch: ['#D9C7AC'] },
      { label: 'Hosting a long dinner', hint: 'Friends, candles, good wine', scores: { 'riviera-limestone': 2, 'heritage-modern': 1, 'salon-particulier': 1 }, swatch: ['#B7835E'] },
      { label: 'Cocktails at golden hour', hint: 'Dressed up, low light', scores: { 'bronze-nocturne': 2, 'salon-particulier': 2 }, swatch: ['#8A6A4A'] },
      { label: 'Family piled on the sofa', hint: 'Comfortable and forgiving', scores: { 'terra-organic': 2, 'quiet-ivory': 1 }, swatch: ['#C49A78'] },
    ],
  },
  {
    id: 'space',
    question: 'Which space are you designing first?',
    options: [
      { label: 'Living and dining', hint: '', scores: { 'quiet-ivory': 1, 'terra-organic': 1, 'heritage-modern': 1 }, swatch: [] },
      { label: 'Kitchen', hint: '', scores: { 'riviera-limestone': 2, 'gallery-loft': 1 }, swatch: [] },
      { label: 'Bedroom or bathroom', hint: '', scores: { 'atelier-japandi': 2, 'bronze-nocturne': 1 }, swatch: [] },
      { label: 'Office, hotel or restaurant', hint: '', scores: { 'gallery-loft': 1, 'salon-particulier': 2 }, swatch: [] },
    ],
  },
]
