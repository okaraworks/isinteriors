import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { RevealLines, Reveal } from './Reveal'

interface Props {
  eyebrow: string
  lines: string[]
  accent?: string
  intro?: ReactNode
  crumbs?: { label: string; to?: string }[]
  children?: ReactNode
}

export function PageHero({ eyebrow, lines, accent, intro, crumbs, children }: Props) {
  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="container-editorial">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {c.to ? (
                    <Link to={c.to} className="link-underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-espresso">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow flex items-center gap-4">
          <span className="h-px w-10 bg-current" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="mt-8 text-display-lg">
          <RevealLines lines={lines} />
          {accent && <RevealLines lines={[accent]} delay={lines.length * 0.12} className="italic text-taupe" />}
        </h1>
        {intro && (
          <Reveal delay={0.3} className="mt-10 max-w-2xl text-[1.05rem] text-ink-soft">
            {intro}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
