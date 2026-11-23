import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface Props {
  index?: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'split'
  action?: ReactNode
  id?: string
  tone?: 'dark' | 'light'
}

export function SectionHeading({ index, eyebrow, title, intro, align = 'split', action, id, tone = 'dark' }: Props) {
  const muted = tone === 'light' ? 'text-ivory/75' : 'text-ink-soft'
  return (
    <div className={`grid gap-8 ${align === 'split' ? 'lg:grid-cols-12 lg:items-end' : ''}`}>
      <Reveal className={align === 'split' ? 'lg:col-span-7' : ''}>
        <p className={`eyebrow flex items-center gap-4 ${tone === 'light' ? 'text-beige' : ''}`}>
          {index && <span className="font-display text-sm tracking-normal">{index}</span>}
          <span className="h-px w-10 bg-current opacity-60" aria-hidden />
          {eyebrow}
        </p>
        <h2 id={id} className="mt-6 text-display-md">
          {title}
        </h2>
      </Reveal>
      {(intro || action) && (
        <Reveal delay={0.1} className={`${align === 'split' ? 'lg:col-span-4 lg:col-start-9' : 'max-w-2xl'} space-y-6`}>
          {intro && <div className={`text-[0.98rem] ${muted}`}>{intro}</div>}
          {action}
        </Reveal>
      )}
    </div>
  )
}
