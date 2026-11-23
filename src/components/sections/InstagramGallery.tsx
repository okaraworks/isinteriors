import { PLACEHOLDER, site } from '../../config/site'
import type { RoomKind } from '../art/RoomScene'
import { Artwork } from '../ui/Artwork'
import { Reveal } from '../ui/Reveal'

const posts: { slug: string; room: RoomKind; alt: string }[] = [
  { slug: 'terra-organic', room: 'vignette', alt: 'Clay-toned console vignette' },
  { slug: 'riviera-limestone', room: 'bath', alt: 'Travertine bathroom with arched mirror' },
  { slug: 'heritage-modern', room: 'dining', alt: 'Panelled dining room' },
  { slug: 'atelier-japandi', room: 'bedroom', alt: 'Ash-panelled bedroom' },
  { slug: 'salon-particulier', room: 'lobby', alt: 'Hotel reception with halo pendant' },
  { slug: 'quiet-ivory', room: 'vignette', alt: 'Ivory console with round mirror' },
]

export function InstagramGallery() {
  const handle = site.social.instagram
  const href = handle ? `https://instagram.com/${handle}` : undefined
  return (
    <section aria-labelledby="ig-title" className="pb-28 sm:pb-36">
      <div className="container-editorial">
        <div className="flex flex-col justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Instagram</p>
            <h2 id="ig-title" className="mt-4 text-display-sm">
              {handle ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
                  @{handle}
                </a>
              ) : (
                <span>
                  @<span className="placeholder-text">{PLACEHOLDER.instagram}</span>
                </span>
              )}
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            Works in progress, material studies and finished rooms. {handle ? '' : 'Connect the studio account to show live posts.'}
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((p, i) => (
            <Reveal as="li" key={i} delay={i * 0.05}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="group block" data-cursor="Open">
                  <Artwork conceptSlug={p.slug} room={p.room} alt={p.alt} className="aspect-square" seedOffset={i} />
                </a>
              ) : (
                <div className="group">
                  <Artwork conceptSlug={p.slug} room={p.room} alt={p.alt} className="aspect-square" seedOffset={i} />
                </div>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
