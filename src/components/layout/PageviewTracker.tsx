import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { trackPageview } from '../../lib/stats'

/** Records an anonymous page view on each route change (consent-gated inside). */
export function PageviewTracker() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname.startsWith('/studio')) return
    void trackPageview(pathname)
  }, [pathname])
  return null
}
