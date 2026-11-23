import { ProjectTile } from '../components/sections/Portfolio'
import { BeforeAfter } from '../components/sections/BeforeAfter'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { Seo } from '../components/ui/Seo'
import { projects } from '../data/projects'
import { conceptBySlug } from '../data/concepts'
import { ButtonLink } from '../components/ui/Button'

export default function Projects() {
  return (
    <>
      <Seo title="Projects" path="/projects" description="Selected residential, commercial and hospitality interior projects by ISOE Interiors." />
      <PageHero
        eyebrow="Portfolio"
        lines={['Selected']}
        accent="projects."
        intro="Illustrative case studies showing how we approach homes, workplaces and hospitality. These will be replaced with the studio's completed projects and photography."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Projects' }]}
      />
      <section className="pb-28" aria-label="Projects">
        <div className="container-editorial space-y-28">
          {projects.map((p, i) => {
            const c = conceptBySlug(p.conceptSlug)!
            return (
              <article id={p.slug} key={p.slug} className="grid scroll-mt-28 gap-10 lg:grid-cols-12" aria-labelledby={`${p.slug}-t`}>
                <Reveal className={`lg:col-span-7 ${i % 2 ? 'lg:order-2 lg:col-start-6' : ''}`}>
                  <ProjectTile p={p} aspect="aspect-[16/11]" priority={i === 0} />
                </Reveal>
                <Reveal delay={0.1} className={`lg:col-span-4 ${i % 2 ? 'lg:order-1' : 'lg:col-start-9'} lg:pt-6`}>
                  <h2 id={`${p.slug}-t`} className="sr-only">
                    {p.title}
                  </h2>
                  <dl className="divide-y divide-line border-y border-line text-sm">
                    {[
                      ['Category', p.category],
                      ['Type', p.type],
                      ['Area', p.area],
                      ['Scope', p.scope],
                      ['Design direction', c.name],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-6 py-3">
                        <dt className="text-ink-soft">{k}</dt>
                        <dd className="text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <ButtonLink to={`/designs/${c.slug}`} variant="text" className="mt-6">
                    Explore {c.name}
                  </ButtonLink>
                </Reveal>
              </article>
            )
          })}
        </div>
      </section>
      <BeforeAfter />
    </>
  )
}
