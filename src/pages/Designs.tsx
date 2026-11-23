import { useState } from 'react'
import { ConceptCard } from '../components/sections/Collections'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { Seo } from '../components/ui/Seo'
import { concepts } from '../data/concepts'
import { ButtonLink } from '../components/ui/Button'

const spaces = ['All', 'Living spaces', 'Bedrooms', 'Kitchens', 'Hospitality', 'Offices'] as const
const matches: Record<(typeof spaces)[number], (s: string) => boolean> = {
  All: () => true,
  'Living spaces': (s) => /living|family|apartment|dining/i.test(s),
  Bedrooms: (s) => /bedroom|suite|bathroom/i.test(s),
  Kitchens: (s) => /kitchen|dining/i.test(s),
  Hospitality: (s) => /hotel|hospitality|restaurant|lounge|reception/i.test(s),
  Offices: (s) => /office|studio|workplace|loft/i.test(s),
}

export default function Designs() {
  const [space, setSpace] = useState<(typeof spaces)[number]>('All')
  const list = concepts.filter((c) => c.suitedTo.some(matches[space]))
  return (
    <>
      <Seo title="Design Collections" path="/designs" description="Eight pre-designed interior collections by ISOE Interiors, each with a palette, materials and key pieces, tailored to your space." />
      <PageHero
        eyebrow="Curated collections"
        lines={['Explore our']}
        accent="designs."
        intro="Each collection is a complete design direction: palette, materials, key pieces and the thinking behind them. Choose a starting point and we tailor it to your rooms, light and budget."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Designs' }]}
      />
      <section className="pb-28 sm:pb-36" aria-label="Design collections">
        <div className="container-editorial">
          <div role="group" aria-label="Filter by space" className="mb-14 flex flex-wrap gap-2">
            {spaces.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={space === s}
                onClick={() => setSpace(s)}
                className={`border px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors ${space === s ? 'border-espresso bg-espresso text-ivory' : 'border-line hover:border-espresso'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 0.08} className={i % 3 === 1 ? 'lg:mt-20' : ''}>
                <ConceptCard slug={c.slug} index={i} priority={i < 3} />
                <p className="mt-4 text-sm text-ink-soft">{c.summary}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-line pt-12 md:flex-row md:items-center">
            <p className="max-w-xl font-display text-3xl leading-tight">Not sure which direction is yours? Take the two-minute style finder.</p>
            <ButtonLink to="/#style-finder" variant="outline">
              Find my style
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  )
}
