import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { MaterialSwatch } from '../components/art/MaterialSwatch'
import { Artwork } from '../components/ui/Artwork'
import { ButtonLink } from '../components/ui/Button'
import { Reveal, RevealLines } from '../components/ui/Reveal'
import { Seo } from '../components/ui/Seo'
import { conceptBySlug, concepts } from '../data/concepts'
import { isDark } from '../lib/color'
import { whatsappLink, whatsappMessages } from '../lib/whatsapp'
import NotFound from './NotFound'

const roomNames: Record<string, string> = {
  living: 'Living room',
  bedroom: 'Bedroom',
  kitchen: 'Kitchen',
  dining: 'Dining room',
  lobby: 'Reception',
  office: 'Workspace',
  bath: 'Bathroom',
  vignette: 'Detail',
}

export default function DesignDetail() {
  const { slug } = useParams()
  const c = conceptBySlug(slug)
  const heroRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])

  if (!c) return <NotFound />

  const idx = concepts.indexOf(c)
  const prev = concepts[(idx - 1 + concepts.length) % concepts.length]
  const next = concepts[(idx + 1) % concepts.length]
  const requestHref = `/book-a-site-visit?type=consultation&design=${c.slug}`
  const wa = whatsappLink(whatsappMessages.design(c.name))

  return (
    <article>
      <Seo
        title={`${c.name} — ${c.style}`}
        path={`/designs/${c.slug}`}
        description={c.summary}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: c.name, genre: c.style, description: c.summary, creator: { '@type': 'Organization', name: 'ISOE Interiors' } }}
      />

      <header className="pt-32 sm:pt-40">
        <div className="container-editorial">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
              <li>
                <Link to="/" className="link-underline">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link to="/designs" className="link-underline">
                  Designs
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-espresso">
                {c.name}
              </li>
            </ol>
          </nav>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow flex items-center gap-4">
                <span className="font-display text-base normal-case tracking-normal">Collection {c.number}</span>
                <span className="h-px w-10 bg-current opacity-60" aria-hidden />
                {c.style}
              </p>
              <h1 className="mt-6 text-display-xl">
                <RevealLines lines={[c.name]} />
              </h1>
            </div>
            <Reveal delay={0.25} className="space-y-6 lg:col-span-4">
              <p className="font-display text-2xl leading-snug text-espresso/85 italic">{c.tagline}</p>
              <ButtonLink to={requestHref}>Request This Design</ButtonLink>
            </Reveal>
          </div>
        </div>
        <div ref={heroRef} className="container-editorial mt-14">
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/9]">
            <motion.div className="absolute -inset-y-[8%] inset-x-0" style={{ y }}>
              <Artwork conceptSlug={c.slug} alt={`${c.name} ${roomNames[c.rooms[0]].toLowerCase()}`} priority zoom={false} className="h-full w-full" />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Story */}
      <section className="py-24 sm:py-32" aria-labelledby="story">
        <div className="container-editorial grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="story" className="eyebrow">
              The design
            </h2>
            <ul className="mt-8 flex flex-wrap gap-2">
              {c.mood.map((m) => (
                <li key={m} className="border border-line px-3 py-1.5 text-xs uppercase tracking-[0.18em]">
                  {m}
                </li>
              ))}
            </ul>
            <dl className="mt-10 space-y-4 text-sm">
              <div>
                <dt className="text-ink-soft">Suited to</dt>
                <dd className="mt-1">{c.suitedTo.join(', ')}</dd>
              </div>
            </dl>
          </Reveal>
          <div className="space-y-6 lg:col-span-7 lg:col-start-6">
            {c.description.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? 'font-display text-[clamp(1.5rem,2.3vw,2.25rem)] leading-snug' : 'text-[1.05rem] text-ink-soft'}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Palette */}
      <section className="pb-24 sm:pb-32" aria-labelledby="palette">
        <div className="container-editorial">
          <Reveal className="flex items-end justify-between border-b border-line pb-6">
            <h2 id="palette" className="text-display-sm">
              Colour palette
            </h2>
            <span className="eyebrow">{c.palette.length} tones</span>
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {c.palette.map((s, i) => (
              <Reveal as="li" key={s.hex} delay={i * 0.06}>
                <div className={`flex aspect-[3/4] flex-col justify-end p-4 sm:aspect-[2/3] ${isDark(s.hex) ? 'text-ivory' : 'text-espresso'}`} style={{ background: s.hex }}>
                  <p className="font-display text-xl leading-tight">{s.name}</p>
                  <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-wider opacity-75">{s.hex}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Materials */}
      <section className="bg-beige/60 py-24 sm:py-32" aria-labelledby="materials">
        <div className="container-editorial">
          <Reveal className="flex items-end justify-between border-b border-line pb-6">
            <h2 id="materials" className="text-display-sm">
              Materials &amp; finishes
            </h2>
            <span className="eyebrow">Specification</span>
          </Reveal>
          <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {c.materials.map((m, i) => (
              <Reveal as="li" key={m.name} delay={i * 0.06}>
                <MaterialSwatch texture={m.texture} color={m.color} seed={c.seed + i} className="aspect-square w-full" title={`${m.name} sample`} />
                <h3 className="mt-5 text-2xl leading-tight">{m.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-taupe">{m.finish}</p>
                <p className="mt-2 text-sm text-ink-soft">{m.use}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 sm:py-32" aria-labelledby="gallery">
        <div className="container-editorial">
          <h2 id="gallery" className="sr-only">
            Imagery
          </h2>
          <div className="grid gap-6 md:grid-cols-12">
            <Reveal className="group md:col-span-7">
              <Artwork conceptSlug={c.slug} room={c.rooms[1]} alt={`${c.name} ${roomNames[c.rooms[1]].toLowerCase()}`} seedOffset={1} className="aspect-[5/4]" />
              <p className="mt-3 text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft">{roomNames[c.rooms[1]]}</p>
            </Reveal>
            <Reveal delay={0.1} className="group md:col-span-5 md:mt-32">
              <Artwork conceptSlug={c.slug} room={c.rooms[2]} alt={`${c.name} ${roomNames[c.rooms[2]].toLowerCase()}`} seedOffset={2} className="aspect-[4/5]" />
              <p className="mt-3 text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft">{roomNames[c.rooms[2]]}</p>
            </Reveal>
            <Reveal className="md:col-span-5 md:col-start-2 md:-mt-10 lg:-mt-24">
              <div className="border-t border-line pt-8">
                <h3 className="eyebrow">Key pieces</h3>
                <ol className="mt-6 space-y-4">
                  {c.keyPieces.map((k, i) => (
                    <li key={k} className="flex gap-5 border-b border-line pb-4 font-display text-2xl">
                      <span className="font-sans text-xs text-taupe">0{i + 1}</span>
                      {k}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="group md:col-span-5 md:col-start-8">
              <Artwork conceptSlug={c.slug} room={c.rooms[3]} alt={`${c.name} ${roomNames[c.rooms[3]].toLowerCase()}`} seedOffset={3} className="aspect-square" />
              <p className="mt-3 text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft">{roomNames[c.rooms[3]]}</p>
            </Reveal>
          </div>
          <p className="mt-10 text-xs text-ink-soft">Illustrative visualisations. Studio photography to follow.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-espresso py-24 text-ivory sm:py-32" aria-labelledby="request">
        <div className="container-editorial grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-beige">Make it yours</p>
            <h2 id="request" className="mt-6 text-display-md">
              Request {c.name},
              <br />
              <em className="text-taupe">tailored to your space.</em>
            </h2>
            <p className="mt-6 max-w-lg text-ivory/75">
              We adapt the palette, materials and key pieces to your rooms, light and budget, starting with a consultation or site visit.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
            <ButtonLink to={requestHref} className="!bg-ivory !text-espresso hover:!bg-beige">
              Request This Design
            </ButtonLink>
            <ButtonLink to={`/book-a-site-visit?design=${c.slug}`} variant="light">
              Book a Site Visit
            </ButtonLink>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline mt-2 self-start text-sm text-ivory/80">
                Ask about this design on WhatsApp ↗
              </a>
            )}
          </Reveal>
        </div>
      </section>

      {/* Prev / next */}
      <nav aria-label="More designs" className="border-b border-line">
        <div className="container-editorial grid sm:grid-cols-2">
          {[
            { c: prev, label: 'Previous' },
            { c: next, label: 'Next' },
          ].map(({ c: x, label }, i) => (
            <Link key={label} to={`/designs/${x.slug}`} className={`group flex items-center gap-6 py-10 ${i === 1 ? 'sm:flex-row-reverse sm:text-right' : ''} ${i === 0 ? 'sm:border-r sm:border-line sm:pr-8' : 'sm:pl-8'}`}>
              <Artwork conceptSlug={x.slug} alt="" className="aspect-square w-24 shrink-0" />
              <span>
                <span className="eyebrow block">{label}</span>
                <span className="mt-2 block font-display text-3xl">{x.name}</span>
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </article>
  )
}
