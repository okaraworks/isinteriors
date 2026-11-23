import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { testimonials } from '../../data/testimonials'
import { Reveal } from '../ui/Reveal'

/**
 * Shows genuine client testimonials from data/testimonials.ts. While that list
 * is empty a clearly marked placeholder is shown instead — nothing is invented.
 */
export function Testimonials() {
  const [i, setI] = useState(0)
  const has = testimonials.length > 0
  const t = testimonials[i]

  return (
    <section aria-labelledby="testimonials-title" className="py-28 sm:py-40">
      <div className="container-editorial">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow flex items-center gap-4">
              <span className="font-display text-sm tracking-normal">10</span>
              <span className="h-px w-10 bg-current opacity-60" aria-hidden />
              Client words
            </p>
            <h2 id="testimonials-title" className="sr-only">
              Testimonials
            </h2>
          </Reveal>
          <div className="lg:col-span-9">
            <span aria-hidden className="block font-display text-[8rem] leading-[0.6] text-taupe/50">
              &ldquo;
            </span>
            {has ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.figure key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6 }}>
                    <blockquote className="font-display text-[clamp(1.8rem,3.4vw,3.4rem)] leading-[1.15]">{t.quote}</blockquote>
                    <figcaption className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink-soft">
                      {t.name} — {t.project}
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
                {testimonials.length > 1 && (
                  <div className="mt-10 flex gap-2">
                    {testimonials.map((_, k) => (
                      <button key={k} type="button" onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} aria-current={k === i} className={`h-px w-10 ${k === i ? 'bg-espresso' : 'bg-line'}`} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Reveal>
                <p className="font-display text-[clamp(1.8rem,3.4vw,3.4rem)] leading-[1.15] text-espresso/35">Client testimonials will appear here.</p>
                <p className="mt-6 inline-block border border-dashed border-taupe px-4 py-2 text-xs uppercase tracking-[0.2em] text-taupe">
                  Placeholder — add genuine client quotes with permission
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
