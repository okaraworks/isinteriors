import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { PLACEHOLDER } from '../../config/site'
import { whatsappLink, whatsappMessages } from '../../lib/whatsapp'

const options = [
  { label: 'General enquiry', message: whatsappMessages.general },
  { label: 'Book a site visit', message: whatsappMessages.siteVisit },
  { label: 'Ask about a design', message: 'Hello ISOE Interiors, I have a question about one of your design collections.' },
]

export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
      />
    </svg>
  )
}

/** Floating WhatsApp contact with pre-written messages. */
export function WhatsAppWidget() {
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const configured = whatsappLink('') !== null

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (panel.current && !panel.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClick)
    }
  }, [open])

  return (
    <div ref={panel} className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            id="whatsapp-panel"
            role="dialog"
            aria-label="Chat with the studio on WhatsApp"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 right-0 w-[min(20rem,calc(100vw-2rem))] border border-line bg-ivory p-6 shadow-[0_24px_60px_-30px_rgba(69,56,47,0.45)]"
          >
            <p className="eyebrow">WhatsApp</p>
            <p className="mt-3 font-display text-2xl leading-tight">Talk to the studio</p>
            <p className="mt-2 text-sm text-ink-soft">Choose a message to start the conversation.</p>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {options.map((o) => {
                const href = whatsappLink(o.message)
                return (
                  <li key={o.label}>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-3 text-sm hover:text-bronze">
                        {o.label} <span aria-hidden>↗</span>
                      </a>
                    ) : (
                      <span className="flex items-center justify-between py-3 text-sm text-ink-soft" aria-disabled>
                        {o.label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
            {!configured && <p className="mt-4 text-xs text-taupe placeholder-text inline-block">{PLACEHOLDER.whatsapp}</p>}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="whatsapp-panel"
        aria-label={open ? 'Close WhatsApp options' : 'Chat on WhatsApp'}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-espresso text-ivory shadow-[0_14px_30px_-14px_rgba(69,56,47,0.7)] transition-colors hover:bg-bronze"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </button>
    </div>
  )
}
