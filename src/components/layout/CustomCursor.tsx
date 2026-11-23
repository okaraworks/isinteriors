import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

/**
 * A fine ring cursor for desktop mouse users. It grows over links and shows a
 * label over imagery marked with `data-cursor="View"`. Not rendered on touch
 * devices, coarse pointers, or when reduced motion is requested.
 */
export function CustomCursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const enabled = fine && !reduce
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [mode, setMode] = useState<'default' | 'link' | 'label'>('default')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-custom-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const t = e.target as Element | null
      const labelled = t?.closest?.('[data-cursor]') as HTMLElement | null
      if (labelled) {
        setMode('label')
        setLabel(labelled.dataset.cursor ?? '')
      } else if (t?.closest?.('a, button, [role="slider"], label, select, summary')) {
        setMode('link')
      } else setMode('default')
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const size = mode === 'label' ? 96 : mode === 'link' ? 44 : 12
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full mix-blend-normal"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: mode === 'label' ? 'rgba(69,56,47,0.92)' : mode === 'link' ? 'rgba(167,139,112,0.12)' : 'rgba(69,56,47,1)',
          borderColor: mode === 'default' ? 'rgba(69,56,47,0)' : 'rgba(69,56,47,0.6)',
        }}
        transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="absolute inset-0 rounded-full border border-inherit" style={{ borderColor: 'inherit' }} />
        {mode === 'label' && <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ivory">{label}</span>}
      </motion.div>
    </>
  )
}
