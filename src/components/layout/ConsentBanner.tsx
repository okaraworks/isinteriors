import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { firebaseConfig, firebaseEnabled, startAnalytics } from '../../lib/firebase'
import { safeStorage } from '../../lib/storage'

const KEY = 'isoe:analytics-consent'

/** Analytics only loads after an explicit "Accept". Hidden when analytics isn't configured. */
export function ConsentBanner() {
  const available = firebaseEnabled && !!firebaseConfig.measurementId
  const [choice, setChoice] = useState<'granted' | 'denied' | null>(() => safeStorage.get(KEY, null))

  useEffect(() => {
    if (choice === 'granted') void startAnalytics()
  }, [choice])

  const decide = (c: 'granted' | 'denied') => {
    safeStorage.set(KEY, c)
    setChoice(c)
  }

  return (
    <AnimatePresence>
      {available && choice === null && (
        <motion.div
          role="region"
          aria-label="Cookie preferences"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory"
        >
          <div className="container-editorial flex flex-col gap-4 py-5 pr-20 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm text-ink-soft">We would like to use analytics cookies to understand how visitors use this site. Nothing is collected unless you accept.</p>
            <div className="flex gap-3">
              <button onClick={() => decide('denied')} className="border border-line px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em]">
                Decline
              </button>
              <button onClick={() => decide('granted')} className="bg-espresso px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ivory">
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
