import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Monogram } from '../brand/Logo'

const KEY = 'isoe:intro-seen'

function seen() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/**
 * A short brand intro on the first visit of a session: the I/I mark draws
 * itself, the studio name fades in, then the curtain lifts. Skipped for
 * reduced motion and on later page views; click or Escape skips it.
 */
export function IntroLoader() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => !seen())

  useEffect(() => {
    if (!show) return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setShow(false), reduce ? 0 : 2300)
    const skip = (e: KeyboardEvent) => e.key === 'Escape' && setShow(false)
    window.addEventListener('keydown', skip)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', skip)
    }
  }, [show, reduce])

  return (
    <AnimatePresence>
      {show && !reduce && (
        <motion.div
          aria-hidden
          onClick={() => setShow(false)}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ivory text-[#172446]"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }} className="flex flex-col items-center">
            <Monogram draw className="h-28 w-24 sm:h-36 sm:w-30" />
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.38em' }}
              transition={{ duration: 1.1, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 text-sm font-semibold"
            >
              ISOE INTERIORS
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.9, delay: 1.45 }}
              className="mt-3 text-[0.62rem] font-semibold tracking-[0.36em]"
            >
              INTERIOR DESIGN STUDIO
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
