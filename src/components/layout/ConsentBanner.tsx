import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { firebaseEnabled, startAnalytics } from '../../lib/firebase'
import { CONSENT_KEY, trackPageview } from '../../lib/stats'
import { startClarity } from '../../lib/clarity'
import { integrations } from '../../config/integrations'
import { safeStorage } from '../../lib/storage'

const KEY = CONSENT_KEY

/** Analytics only loads after an explicit "Accept". Hidden when analytics isn't configured. */
export function ConsentBanner() {
  const available = firebaseEnabled || !!integrations.clarityId
  const [choice, setChoice] = useState<'granted' | 'denied' | null>(() => safeStorage.get(KEY, null))

  useEffect(() => {
    if (choice === 'granted') {
      void startAnalytics()
      startClarity()
    }
  }, [choice])

  const decide = (c: 'granted' | 'denied') => {
    safeStorage.set(KEY, c)
    setChoice(c)
    if (c === 'granted') void trackPageview(window.location.pathname)
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
            <p className="max-w-2xl text-sm text-ink-soft">May we count your visit? We record anonymous page views (no names, IDs or IP addresses) to understand which designs people like. With your permission we may also use Microsoft Clarity to see how pages are used. Nothing is collected unless you accept.</p>
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
