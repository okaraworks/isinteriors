import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

/**
 * Inertial smooth scrolling on desktop pointers only. Touch devices keep native
 * scrolling (better for performance and accessibility) and it is fully
 * disabled for users who prefer reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const fine = useMediaQuery('(pointer: fine)')
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduce || !fine) return
    const l = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
    let raf = 0
    const loop = (time: number) => {
      l.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    setLenis(l)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
      setLenis(null)
    }
  }, [reduce, fine])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
