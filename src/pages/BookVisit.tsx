import { useSearchParams } from 'react-router'
import { SchedulingEmbed } from '../components/forms/SchedulingEmbed'
import { SiteVisitForm } from '../components/forms/SiteVisitForm'
import { StudioMap } from '../components/map/StudioMap'
import { Artwork } from '../components/ui/Artwork'
import { PageHero } from '../components/ui/PageHero'
import { Seo } from '../components/ui/Seo'
import { PLACEHOLDER, site } from '../config/site'
import { processSteps } from '../data/services'

export default function BookVisit() {
  const [params] = useSearchParams()
  const type = params.get('type') === 'consultation' ? 'consultation' : 'site-visit'
  const design = params.get('design') ?? undefined
  const moodboard = (params.get('moodboard') ?? '').split(',').filter(Boolean).slice(0, 12)
  const estimate = params.get('estimate')?.slice(0, 300) ?? undefined
  const c = site.contact

  return (
    <>
      <Seo
        title={type === 'consultation' ? 'Request a Consultation' : 'Book a Site Visit'}
        path="/book-a-site-visit"
        description="Book a site visit or request a design consultation with ISOE Interiors. Share your space, photos and preferred date."
      />
      <PageHero
        eyebrow={type === 'consultation' ? 'Request a consultation' : 'Book a site visit'}
        lines={['Start your']}
        accent="project."
        intro="Tell us about your space. We will confirm a date, then visit to measure, photograph and talk through what you would like to achieve."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Book a site visit' }]}
      />
      <section className="pb-28 sm:pb-36">
        <div className="container-editorial grid gap-16 lg:grid-cols-12">
          <div className="space-y-16 lg:col-span-7">
            {type === 'consultation' && <SchedulingEmbed />}
            <SiteVisitForm initialType={type} design={design} moodboard={moodboard} estimate={estimate} />
            {type !== 'consultation' && <SchedulingEmbed />}
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <Artwork conceptSlug={design ?? 'quiet-ivory'} room="vignette" alt="Interior detail" className="aspect-[4/3]" zoom={false} />
              <h2 className="mt-10 eyebrow">What happens next</h2>
              <ol className="mt-6 space-y-5">
                {processSteps.slice(0, 3).map((s) => (
                  <li key={s.n} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line pb-5">
                    <span className="font-display text-lg text-taupe">{s.n}</span>
                    <span>
                      <span className="block font-display text-2xl">{s.title}</span>
                      <span className="mt-1 block text-sm text-ink-soft">{s.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-10 space-y-2 text-sm">
                <p className="eyebrow">Or contact the studio</p>
                <p>{c.phone ? <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="link-underline">{c.phone}</a> : <span className="placeholder-text text-ink-soft">{PLACEHOLDER.phone}</span>}</p>
                <p>{c.email ? <a href={`mailto:${c.email}`} className="link-underline">{c.email}</a> : <span className="placeholder-text text-ink-soft">{PLACEHOLDER.email}</span>}</p>
              </div>
              <h2 className="mt-10 eyebrow">Find the studio</h2>
              <p className="mt-3 text-sm">{c.address?.length ? c.address.join(', ') : <span className="placeholder-text text-ink-soft">{PLACEHOLDER.address[0]}</span>}</p>
              <StudioMap className="mt-5" />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
