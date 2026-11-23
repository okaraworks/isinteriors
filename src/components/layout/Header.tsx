import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { navigation } from '../../config/site'
import { Logo } from '../brand/Logo'
import { ButtonLink } from '../ui/Button'
import { useLenis } from './SmoothScroll'

export function Header() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const lenis = useLenis()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 320 && y > prev && !open)
  })

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [location.pathname, location.hash])

  // Lock scroll and support Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenis])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-espresso focus:px-4 focus:py-2 focus:text-ivory">
        Skip to content
      </a>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
          scrolled || open ? 'border-b border-line bg-ivory/92 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
        }`}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-editorial flex h-20 items-center justify-between gap-6">
          <Link to="/" aria-label="ISOE Interiors — home" className="relative z-10 text-espresso">
            <Logo draw />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {navigation.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `link-underline text-[0.72rem] font-semibold uppercase tracking-[0.22em] ${isActive && !item.to.includes('#') ? 'bg-[length:100%_1px]' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block">
              <ButtonLink to="/book-a-site-visit" className="!px-5 !py-3" arrow={false}>
                Book a Site Visit
              </ButtonLink>
            </span>
            <button
              type="button"
              className="relative z-10 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`h-px w-7 bg-espresso transition-transform duration-500 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
              <span className={`h-px w-7 bg-espresso transition-transform duration-500 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-ivory pt-24 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile" className="container-editorial flex-1 overflow-y-auto">
              <ul className="divide-y divide-line border-y border-line">
                {[{ label: 'Home', to: '/' }, ...navigation].map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link to={item.to} className="flex items-baseline justify-between py-4 font-display text-4xl">
                      {item.label}
                      <span className="font-sans text-xs tracking-[0.2em] text-taupe">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3 pb-10">
                <ButtonLink to="/book-a-site-visit">Book a Site Visit</ButtonLink>
                <ButtonLink to="/book-a-site-visit?type=consultation" variant="outline">
                  Request a Consultation
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
