import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router'
import { services } from '../../data/services'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { Artwork } from '../ui/Artwork'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** Editorial index of services; on desktop an image follows the pointer. */
export function ServicesIndex() {
  const [active, setActive] = useState<number | null>(null)
  const hover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 26 })
  const sy = useSpring(y, { stiffness: 180, damping: 26 })

  return (
    <section aria-labelledby="services-title" className="bg-beige/60 py-28 sm:py-36">
      <div className="container-editorial">
        <SectionHeading
          index="02"
          eyebrow="Services"
          id="services-title"
          title={
            <>
              Every kind of space,
              <br />
              <em className="text-taupe">one point of view.</em>
            </>
          }
          intro="From a single kitchen to a full hotel, each project is led by the same principles and the same studio team."
          action={<ButtonLink to="/services" variant="text">All services</ButtonLink>}
        />

        <div
          className="relative mt-20"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            x.set(e.clientX - r.left)
            y.set(e.clientY - r.top)
          }}
          onPointerLeave={() => setActive(null)}
        >
          <ul className="border-t border-line">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 4) * 0.05} className="border-b border-line">
                <Link
                  to={`/services#${s.slug}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[5rem_1fr_1fr_auto] sm:py-8"
                >
                  <span className="font-display text-lg text-taupe">{s.number}</span>
                  <span className="font-display text-[clamp(1.7rem,3.6vw,3.6rem)] leading-none transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:translate-x-3">
                    {s.title}
                  </span>
                  <span className="hidden max-w-sm text-sm text-ink-soft sm:block">{s.summary}</span>
                  <span aria-hidden className="text-xl transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          {hover && !reduce && (
            <motion.div className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block" style={{ x: sx, y: sy }}>
              <AnimatePresence>
                {active !== null && (
                  <motion.div
                    key={active}
                    className="absolute h-[19rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9, clipPath: 'inset(20% 20% 20% 20%)' }}
                    animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Artwork conceptSlug={services[active].conceptSlug} room={services[active].room} alt="" zoom={false} className="h-full w-full" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
