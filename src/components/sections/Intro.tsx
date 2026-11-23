import { Artwork } from '../ui/Artwork'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

const principles = [
  { n: 'I', title: 'Architecture first', text: 'We start with light, proportion and circulation. Decoration follows the structure, never the other way round.' },
  { n: 'II', title: 'Materials that age well', text: 'Stone, timber, plaster and natural cloth, chosen to look better in ten years than on the day they are installed.' },
  { n: 'III', title: 'One studio, start to finish', text: 'Survey, design, procurement and installation handled by one team, so the idea survives all the way to handover.' },
]

export function Intro() {
  return (
    <section id="studio" aria-labelledby="studio-title" className="py-28 sm:py-40">
      <div className="container-editorial">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow flex items-center gap-4">
              <span className="font-display text-sm tracking-normal">01</span>
              <span className="h-px w-10 bg-current opacity-60" aria-hidden />
              The studio
            </p>
          </Reveal>
          <div className="lg:col-span-9">
            <Reveal>
              <h2 id="studio-title" className="text-display-sm !leading-[1.25] sm:text-[clamp(1.8rem,3.1vw,3.4rem)]">
                We design interiors that feel inevitable: rooms where the light, the materials and the way you move through them simply make
                sense. <span className="text-taupe">Considered, tactile and built to last.</span>
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <div className="group" data-cursor="Studio">
              <Artwork conceptSlug="atelier-japandi" room="vignette" alt="Console with ceramic vase and round mirror" className="aspect-[4/5]" />
            </div>
          </Reveal>
          <div className="flex flex-col justify-between gap-12 lg:col-span-6 lg:col-start-7">
            <ol className="divide-y divide-line border-y border-line">
              {principles.map((p, i) => (
                <Reveal as="li" key={p.n} delay={i * 0.08} className="grid grid-cols-[3.5rem_1fr] gap-4 py-8">
                  <span className="font-display text-2xl text-taupe">{p.n}</span>
                  <div>
                    <h3 className="text-3xl">{p.title}</h3>
                    <p className="mt-3 max-w-md text-ink-soft">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <Reveal className="flex flex-wrap gap-6">
              <ButtonLink to="/services" variant="text">
                Our services
              </ButtonLink>
              <ButtonLink to="/projects" variant="text">
                Selected projects
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
