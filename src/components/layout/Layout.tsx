import { AnimatePresence, motion } from 'framer-motion'
import { Suspense } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { ConsentBanner } from './ConsentBanner'
import { CustomCursor } from './CustomCursor'
import { Footer } from './Footer'
import { Header } from './Header'
import { IntroLoader } from './IntroLoader'
import { PageviewTracker } from './PageviewTracker'
import { ScrollManager } from './ScrollManager'
import { WhatsAppWidget } from './WhatsAppWidget'

function PageFallback() {
  return <div className="min-h-[70vh]" aria-busy="true" />
}

export function Layout() {
  const location = useLocation()
  // Capture the outlet so the exiting page keeps its own content during the transition.
  const outlet = useOutlet()
  return (
    <>
      <IntroLoader />
      <ScrollManager />
      <PageviewTracker />
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={location.pathname}
          tabIndex={-1}
          className="outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<PageFallback />}>
            {outlet}
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppWidget />
      <ConsentBanner />
      <CustomCursor />
    </>
  )
}
