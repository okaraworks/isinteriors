import { motion, useReducedMotion } from 'framer-motion'
import { site } from '../../config/site'

interface MonogramProps {
  className?: string
  title?: string
  /** Draw the mark in: strokes trace, the diagonal cuts through, gold dots settle. */
  draw?: boolean
  delay?: number
}

/** Brand colours taken from the studio's logo artwork. */
export const BRAND_NAVY = '#172446'
export const BRAND_GOLD = '#C19A55'

const EASE = [0.65, 0, 0.35, 1] as const

/**
 * The I/I monogram, redrawn as vector from the studio's logo: two fine
 * vertical strokes, each with a gold dot, split by a thin diagonal.
 * Strokes use `currentColor` (navy by default) so the mark can sit on dark
 * backgrounds; the dots stay gold. Inside a `.group`, hovering lifts the dots.
 */
export function Monogram({ className, title, draw = false, delay = 0 }: MonogramProps) {
  const reduce = useReducedMotion()
  const animate = draw && !reduce
  const line = (i: number, d = 0.9) =>
    animate
      ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { pathLength: { duration: d, ease: EASE, delay: delay + i }, opacity: { duration: 0.01, delay: delay + i } } }
      : {}
  const dot = (i: number) =>
    animate
      ? { initial: { y: -26, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { type: 'spring' as const, stiffness: 260, damping: 16, delay: delay + i } }
      : {}
  return (
    <svg viewBox="262 190 196 238" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} overflow="visible">
      <g stroke="currentColor" strokeLinecap="round" fill="none">
        <motion.line x1="321" y1="238" x2="321" y2="306" strokeWidth="4.4" {...line(0, 0.6)} />
        <motion.line x1="403" y1="411" x2="403" y2="343" strokeWidth="4.4" {...line(0.25, 0.6)} />
        <motion.line x1="276" y1="399" x2="443" y2="234" strokeWidth="2" {...line(0.55, 0.8)} />
      </g>
      <g className="transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:-translate-y-[10px]">
        <motion.circle cx="321" cy="208" r="6.6" fill={BRAND_GOLD} {...dot(1.05)} />
      </g>
      <g className="transition-transform delay-75 duration-500 ease-[var(--ease-editorial)] group-hover:-translate-y-[10px]">
        <motion.circle cx="402" cy="314" r="6.6" fill={BRAND_GOLD} {...dot(1.2)} />
      </g>
    </svg>
  )
}

interface LogoProps {
  className?: string
  /** Hide the wordmark on very small screens. */
  compact?: boolean
}

export function Logo({ className = '', compact = false, draw = false }: LogoProps & { draw?: boolean }) {
  return (
    <span className={`group inline-flex items-center gap-3 ${className}`}>
      <Monogram className="h-12 w-10 shrink-0 text-[#172446]" draw={draw} delay={0.1} />
      <span className={`flex flex-col leading-none text-[#172446] ${compact ? 'max-sm:sr-only' : ''}`}>
        <span className="text-[0.92rem] font-semibold tracking-[0.34em]">ISOE INTERIORS</span>
        <span className="mt-1.5 text-[0.52rem] font-semibold tracking-[0.36em] opacity-75">INTERIOR DESIGN STUDIO</span>
      </span>
      <span className="sr-only">{site.name}</span>
    </span>
  )
}
