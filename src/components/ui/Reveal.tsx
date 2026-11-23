import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'section' | 'article'
}

/** Subtle fade-and-rise on first view. Disabled for reduced-motion users. */
export function Reveal({ delay = 0, y = 28, as = 'div', children, ...rest }: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as typeof motion.div
  if (reduce) return <Comp {...rest}>{children}</Comp>
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Line-by-line headline reveal (each child line slides up from a mask). */
export function RevealLines({ lines, className = '', delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          {reduce ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block"
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.12 }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  )
}
