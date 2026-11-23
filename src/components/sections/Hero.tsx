import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Artwork } from '../ui/Artwork'
import { ButtonLink } from '../ui/Button'
import { RevealLines } from '../ui/Reveal'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08])
  const smallY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%'])

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="container-editorial">
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="relative z-10 lg:col-span-7 lg:pt-10 xl:pt-16">
            <motion.p
              className="eyebrow flex items-center gap-4"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
            >
              <span className="h-px w-10 bg-current" aria-hidden />
              Interior architecture &amp; design studio
            </motion.p>
            <h1 id="hero-title" className="mt-8 text-display-xl lg:mr-[-22%]">
              <RevealLines lines={['Spaces', 'composed with']} delay={0.15} />
              <RevealLines lines={['quiet intent.']} delay={0.39} className="italic text-taupe" />
            </h1>
            <motion.div
              className="mt-10 grid max-w-xl gap-8 sm:mt-14"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[1.05rem] leading-relaxed text-ink-soft">
                ISOE Interiors designs calm, crafted homes, workplaces and hospitality spaces, from the first site visit to the final styled
                room.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/designs">Explore Our Designs</ButtonLink>
                <ButtonLink to="/book-a-site-visit" variant="outline">
                  Book a Site Visit
                </ButtonLink>
              </div>
            </motion.div>
          </div>

          <div className="relative lg:col-span-5">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5.4]"
              initial={reduce ? false : { clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)' }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            >
              <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
                <Artwork conceptSlug="quiet-ivory" alt="Tonal living room with an arched window, linen sofa and travertine table" priority zoom={false} className="h-full w-full" />
              </motion.div>
            </motion.div>
            <p className="mt-3 flex justify-between text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft">
              <span>Quiet Ivory — Living</span>
              <span>Collection 01</span>
            </p>
            <motion.div
              style={{ y: smallY }}
              className="absolute -left-[34%] bottom-[10%] hidden w-[34%] border-[10px] border-ivory xl:block"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
            >
              <Artwork conceptSlug="riviera-limestone" room="kitchen" alt="Stone kitchen with travertine island" zoom={false} className="aspect-[4/5]" />
            </motion.div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-line py-6 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink-soft sm:grid-cols-4 lg:mt-20">
          <span>Residential</span>
          <span>Commercial</span>
          <span>Hospitality</span>
          <a href="#studio" className="flex items-center gap-3 justify-self-start sm:justify-self-end">
            Scroll
            <motion.span
              aria-hidden
              className="block h-6 w-px bg-current"
              animate={reduce ? undefined : { scaleY: [0, 1, 0], originY: [0, 0, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </a>
        </div>
      </div>
    </section>
  )
}
