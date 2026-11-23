import { Link } from 'react-router'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'solid' | 'outline' | 'light' | 'text'

const base =
  'group relative inline-flex items-center justify-center gap-3 whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ease-[var(--ease-editorial)] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  solid: 'bg-espresso text-ivory px-7 py-4 hover:bg-bronze',
  outline: 'border border-espresso/70 text-espresso px-7 py-4 hover:bg-espresso hover:text-ivory',
  light: 'border border-ivory/70 text-ivory px-7 py-4 hover:bg-ivory hover:text-espresso',
  text: 'text-espresso py-2',
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 10" className={`h-2.5 w-7 transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-1.5 ${className}`} aria-hidden>
      <path d="M0 5h26M22 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

interface CommonProps {
  variant?: Variant
  arrow?: boolean
  className?: string
  children: ReactNode
}

export function ButtonLink({ to, variant = 'solid', arrow = true, className = '', children, ...rest }: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <span className={variant === 'text' ? 'link-underline' : ''}>{children}</span>
      {arrow && <Arrow />}
    </Link>
  )
}

export function Button({ variant = 'solid', arrow = false, className = '', children, ...rest }: CommonProps & ComponentProps<'button'>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  )
}
