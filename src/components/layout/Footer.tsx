import { osmLink } from '../map/StudioMap'
import { Link } from 'react-router'
import { PLACEHOLDER, site } from '../../config/site'
import { services } from '../../data/services'
import { concepts } from '../../data/concepts'
import { Monogram } from '../brand/Logo'
import { ButtonLink } from '../ui/Button'

function Value({ value, placeholder, href }: { value: string | null; placeholder: string; href?: string }) {
  if (!value) return <span className="placeholder-text">{placeholder}</span>
  return href ? (
    <a href={href} className="link-underline">
      {value}
    </a>
  ) : (
    <span>{value}</span>
  )
}

export function Footer() {
  const c = site.contact
  return (
    <footer className="bg-espresso text-ivory" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container-editorial pt-24 pb-10 sm:pt-32">
        <div className="grid gap-14 border-b border-ivory/15 pb-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-beige">Start your project</p>
            <p className="mt-6 font-display text-display-lg">
              Let&rsquo;s shape a space
              <br />
              <em className="text-taupe">worth coming home to.</em>
            </p>
          </div>
          <div className="flex flex-col items-start justify-end gap-3 sm:flex-row sm:items-end lg:col-span-5 lg:justify-end">
            <ButtonLink to="/book-a-site-visit" variant="light">
              Book a Site Visit
            </ButtonLink>
            <ButtonLink to="/book-a-site-visit?type=consultation" className="!bg-ivory !text-espresso hover:!bg-beige">
              Request a Consultation
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Monogram className="h-20 w-16 text-ivory" title="ISOE Interiors I/I monogram" />
            <p className="mt-6 max-w-xs text-sm text-ivory/70">{site.description}</p>
          </div>
          <nav aria-label="Services" className="lg:col-span-3">
            <p className="eyebrow text-beige/80">Services</p>
            <ul className="mt-5 space-y-2.5 text-sm text-ivory/80">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services#${s.slug}`} className="link-underline">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Design collections" className="lg:col-span-2">
            <p className="eyebrow text-beige/80">Designs</p>
            <ul className="mt-5 space-y-2.5 text-sm text-ivory/80">
              {concepts.map((c) => (
                <li key={c.slug}>
                  <Link to={`/designs/${c.slug}`} className="link-underline">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <address className="not-italic lg:col-span-3">
            <p className="eyebrow text-beige/80">Studio</p>
            <ul className="mt-5 space-y-2.5 text-sm text-ivory/80">
              <li>
                <Value value={c.address?.length ? c.address.join(', ') : null} placeholder={PLACEHOLDER.address[0]} />
                {osmLink && (
                  <a href={osmLink} target="_blank" rel="noopener noreferrer" className="link-underline ml-2 text-xs uppercase tracking-[0.18em]">
                    Map ↗
                  </a>
                )}
              </li>
              <li>
                <Value value={c.phone} placeholder={PLACEHOLDER.phone} href={c.phone ? `tel:${c.phone.replace(/\s/g, '')}` : undefined} />
              </li>
              <li>
                <Value value={c.email} placeholder={PLACEHOLDER.email} href={c.email ? `mailto:${c.email}` : undefined} />
              </li>
              <li>
                <Value value={c.hours} placeholder={PLACEHOLDER.hours} />
              </li>
              <li className="pt-3">
                {site.social.instagram ? (
                  <a href={`https://instagram.com/${site.social.instagram}`} target="_blank" rel="noopener noreferrer" className="link-underline">
                    Instagram ↗
                  </a>
                ) : (
                  <span className="placeholder-text">Instagram handle — to be added</span>
                )}
              </li>
            </ul>
          </address>
        </div>

        <div aria-hidden className="select-none overflow-hidden">
          <svg viewBox="0 0 1000 116" className="w-full text-ivory/[0.07]">
            <text x="0" y="104" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="currentColor" className="font-display" fontSize="128">
              ISOE INTERIORS
            </text>
          </svg>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-ivory/15 pt-8 text-xs text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <Link to="/privacy" className="link-underline">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/designs" className="link-underline">
                Explore our designs
              </Link>
            </li>
            <li>
              <Link to="/studio" className="link-underline">
                Studio login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
