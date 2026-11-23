import { processSteps } from '../../data/services'
import { Artwork } from '../ui/Artwork'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

export function ConsultationCTA() {
  return (
    <section aria-labelledby="visit-title" className="bg-espresso text-ivory">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[60vh] lg:min-h-full">
          <Artwork conceptSlug="bronze-nocturne" room="living" alt="Low-lit living room in smoked oak and bronze" zoom={false} className="absolute inset-0" />
        </div>
        <div className="px-[clamp(1rem,5vw,6rem)] py-24 sm:py-32">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-beige">
              <span className="font-display text-sm tracking-normal">09</span>
              <span className="h-px w-10 bg-current opacity-60" aria-hidden />
              Begin with a visit
            </p>
            <h2 id="visit-title" className="mt-6 text-display-md">
              We start where
              <br />
              <em className="text-taupe">you live and work.</em>
            </h2>
            <p className="mt-6 max-w-md text-ivory/75">
              Every project begins on site. We measure, photograph and listen, then return with a clear direction and next steps.
            </p>
          </Reveal>
          <ol className="mt-12 grid gap-px bg-ivory/15 sm:grid-cols-2">
            {processSteps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.06} className="bg-espresso p-6 sm:p-7">
                <span className="font-display text-taupe">{s.n}</span>
                <h3 className="mt-3 text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-ivory/70">{s.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-12 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/book-a-site-visit" className="!bg-ivory !text-espresso hover:!bg-beige">
              Book a Site Visit
            </ButtonLink>
            <ButtonLink to="/book-a-site-visit?type=consultation" variant="light">
              Request a Consultation
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
