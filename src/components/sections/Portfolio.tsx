import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router'
import { projects, type Project } from '../../data/projects'
import { Artwork } from '../ui/Artwork'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const filters = ['All', 'Residential', 'Commercial', 'Hospitality'] as const

/** Project tile that cross-fades through the project's rooms on hover. */
export function ProjectTile({ p, aspect, priority = false }: { p: Project; aspect: string; priority?: boolean }) {
  const [frame, setFrame] = useState(0)
  return (
    <Link
      to={`/projects#${p.slug}`}
      className="group block"
      data-cursor="View"
      onPointerEnter={() => setFrame(1)}
      onPointerLeave={() => setFrame(0)}
      onFocus={() => setFrame(1)}
      onBlur={() => setFrame(0)}
    >
      <div className={`relative ${aspect}`}>
        {p.rooms.slice(0, 2).map((room, i) => (
          <div key={room} className={`absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-editorial)] ${frame === i ? 'opacity-100' : 'opacity-0'}`}>
            <Artwork conceptSlug={p.conceptSlug} room={room} alt={`${p.title}, ${room} view`} priority={priority} className="h-full w-full" />
          </div>
        ))}
        <span className="absolute left-4 top-4 bg-ivory/90 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em]">{p.category}</span>
      </div>
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-3xl leading-tight">{p.title}</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-ink-soft">
          {p.type} · {p.area}
        </span>
      </div>
      <p className="mt-2 max-w-md text-sm text-ink-soft">{p.brief}</p>
    </Link>
  )
}

export function Portfolio() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const list = projects.filter((p) => filter === 'All' || p.category === filter).slice(0, 4)
  const aspects = ['aspect-[4/5]', 'aspect-[5/4]', 'aspect-[5/4]', 'aspect-[4/5]']

  return (
    <section aria-labelledby="portfolio-title" className="py-28 sm:py-36">
      <div className="container-editorial">
        <SectionHeading
          index="04"
          eyebrow="Portfolio"
          id="portfolio-title"
          title={
            <>
              Selected <em className="text-taupe">projects</em>
            </>
          }
          intro={<p>Illustrative case studies showing how the studio approaches homes, workplaces and hospitality. Studio photography to follow.</p>}
        />

        <div role="tablist" aria-label="Filter projects" className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-b border-line">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`relative -mb-px pb-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-colors ${filter === f ? 'text-espresso' : 'text-ink-soft hover:text-espresso'}`}
            >
              {f}
              {filter === f && <motion.span layoutId="portfolio-tab" className="absolute inset-x-0 bottom-0 h-px bg-espresso" />}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={i % 2 === 1 ? 'md:mt-28' : ''}
              >
                <ProjectTile p={p} aspect={aspects[i % aspects.length]} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-20 flex justify-center">
          <ButtonLink to="/projects" variant="outline">
            View all projects
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
