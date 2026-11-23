import { Link } from 'react-router'
import { Artwork } from '../components/ui/Artwork'
import { ButtonLink } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { Seo } from '../components/ui/Seo'
import { conceptBySlug } from '../data/concepts'
import { processSteps, services } from '../data/services'

export default function Services() {
  return (
    <>
      <Seo
        title="Interior Design Services"
        path="/services"
        description="Residential, commercial and hospitality interior design, kitchens, bedrooms, living spaces, renovation and space planning by ISOE Interiors."
      />
      <PageHero
        eyebrow="Services"
        lines={['Design for every']}
        accent="kind of space."
        intro="Whether it is one room or a whole building, the studio leads from first survey to final styling. Choose the service closest to your project; most combine several."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />
      <section aria-label="Services list" className="pb-24">
        <div className="container-editorial space-y-24 sm:space-y-36">
          {services.map((s, i) => {
            const c = conceptBySlug(s.conceptSlug)!
            const flip = i % 2 === 1
            return (
              <article key={s.slug} id={s.slug} className="grid scroll-mt-28 gap-10 lg:grid-cols-12 lg:items-center" aria-labelledby={`${s.slug}-title`}>
                <Reveal className={`group lg:col-span-6 ${flip ? 'lg:order-2 lg:col-start-7' : ''}`}>
                  <Artwork conceptSlug={s.conceptSlug} room={s.room} alt={`${s.title}: ${c.name} scheme`} className="aspect-[5/4]" />
                </Reveal>
                <Reveal delay={0.1} className={`lg:col-span-5 ${flip ? 'lg:order-1' : 'lg:col-start-8'}`}>
                  <p className="font-display text-xl text-taupe">{s.number}</p>
                  <h2 id={`${s.slug}-title`} className="mt-3 text-display-md">
                    {s.title}
                  </h2>
                  <p className="mt-6 text-[1.05rem] text-ink-soft">{s.summary}</p>
                  <ul className="mt-8 divide-y divide-line border-y border-line">
                    {s.includes.map((x) => (
                      <li key={x} className="flex items-center gap-4 py-3 text-sm">
                        <span className="h-px w-4 bg-taupe" aria-hidden />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <ButtonLink to={`/book-a-site-visit?service=${s.slug}`}>Start Your Project</ButtonLink>
                    <Link to={`/designs/${c.slug}`} className="link-underline text-sm">
                      See {c.name}
                    </Link>
                  </div>
                </Reveal>
              </article>
            )
          })}
        </div>
      </section>
      <section aria-labelledby="process" className="mt-16 bg-beige/60 py-24 sm:py-32">
        <div className="container-editorial">
          <Reveal>
            <p className="eyebrow">How we work</p>
            <h2 id="process" className="mt-6 text-display-md">
              From site visit <em className="text-taupe">to handover.</em>
            </h2>
          </Reveal>
          <ol className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.06} className="bg-[#f3eee6] p-8">
                <span className="font-display text-4xl text-taupe">{s.n}</span>
                <h3 className="mt-6 text-3xl">{s.title}</h3>
                <p className="mt-3 text-sm text-ink-soft">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
