import { useRef } from 'react'
import { Link } from 'react-router'
import { concepts } from '../../data/concepts'
import { Artwork } from '../ui/Artwork'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function ConceptCard({ slug, index, priority = false, className = '' }: { slug: string; index: number; priority?: boolean; className?: string }) {
  const c = concepts.find((x) => x.slug === slug)!
  return (
    <Link to={`/designs/${c.slug}`} className={`group block ${className}`} data-cursor="View">
      <div className="relative">
        <Artwork conceptSlug={c.slug} alt={`${c.name}: ${c.style} interior`} priority={priority} seedOffset={index} className="aspect-[4/5]" />
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 gap-1 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
          {c.palette.map((s) => (
            <span key={s.hex} className="h-5 flex-1 border border-white/40" style={{ background: s.hex }} title={s.name} />
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-line pb-4">
        <h3 className="text-3xl leading-none sm:text-[2.1rem]">{c.name}</h3>
        <span className="font-display text-taupe">{c.number}</span>
      </div>
      <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink-soft">{c.style}</p>
    </Link>
  )
}

/** Horizontally scrolling rail of the pre-designed collections. */
export function Collections() {
  const rail = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => {
    const el = rail.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section id="designs" aria-labelledby="collections-title" className="py-28 sm:py-40">
      <div className="container-editorial">
        <SectionHeading
          index="03"
          eyebrow="Curated collections"
          id="collections-title"
          title={
            <>
              Pre-designed interiors,
              <br />
              <em className="text-taupe">tailored to your space.</em>
            </>
          }
          intro="Eight studio design directions, each with a defined palette, material library and key pieces. Choose one as your starting point and we adapt it to your rooms, light and budget."
          action={
            <div className="flex items-center gap-3">
              <ButtonLink to="/designs">Explore Our Designs</ButtonLink>
              <div className="ml-auto hidden gap-2 sm:flex">
                <button type="button" onClick={() => scroll(-1)} className="h-12 w-12 border border-line transition-colors hover:bg-espresso hover:text-ivory" aria-label="Previous designs">
                  ←
                </button>
                <button type="button" onClick={() => scroll(1)} className="h-12 w-12 border border-line transition-colors hover:bg-espresso hover:text-ivory" aria-label="Next designs">
                  →
                </button>
              </div>
            </div>
          }
        />
      </div>
      <Reveal>
        <div
          ref={rail}
          className="no-scrollbar mt-16 flex snap-x snap-mandatory scroll-px-[clamp(1rem,4vw,4rem)] gap-5 overflow-x-auto scroll-smooth px-[clamp(1rem,4vw,4rem)] pb-4 sm:gap-8"
          role="region"
          aria-label="Design collections"
          tabIndex={0}
          data-lenis-prevent-wheel=""
        >
          {concepts.map((c, i) => (
            <ConceptCard key={c.slug} slug={c.slug} index={i} className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[29vw] 2xl:w-[24vw]" />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
