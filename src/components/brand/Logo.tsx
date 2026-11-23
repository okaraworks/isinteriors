import { site } from '../../config/site'

interface MonogramProps {
  className?: string
  title?: string
}

/** The I/I monogram: two serif capitals divided by a fine bronze oblique. */
export function Monogram({ className, title }: MonogramProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g fill="currentColor">
        <rect x="15" y="12" width="4.2" height="40" />
        <rect x="9.6" y="12" width="15" height="1.6" />
        <rect x="9.6" y="50.4" width="15" height="1.6" />
        <rect x="44.8" y="12" width="4.2" height="40" />
        <rect x="39.4" y="12" width="15" height="1.6" />
        <rect x="39.4" y="50.4" width="15" height="1.6" />
      </g>
      <path d="M37.6 8 26.4 56" stroke="var(--color-taupe)" strokeWidth="1.6" />
    </svg>
  )
}

interface LogoProps {
  className?: string
  /** Hide the wordmark on very small screens. */
  compact?: boolean
}

export function Logo({ className = '', compact = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Monogram className="h-9 w-9 shrink-0" />
      <span className={`flex flex-col leading-none ${compact ? 'max-sm:sr-only' : ''}`}>
        <span className="font-display text-[1.35rem] font-medium tracking-[0.34em]">ISOE</span>
        <span className="mt-1 text-[0.56rem] font-semibold tracking-[0.52em] text-current/70">INTERIORS</span>
      </span>
      <span className="sr-only">{site.name}</span>
    </span>
  )
}
