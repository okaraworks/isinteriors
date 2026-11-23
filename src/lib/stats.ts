/**
 * First-party, privacy-respecting site statistics stored in Firestore.
 *
 * • Runs only after the visitor accepts analytics in the consent banner.
 * • Stores no IDs, IPs, cookies or user agents: each event is one anonymous
 *   document { type, path, design, device, referrer host, newVisitor, day }.
 * • "Visitors" are unique per browser per day (a date in localStorage).
 * • Free-tier cost: one Firestore write per page view (Spark allows 20,000
 *   writes/day); the dashboard reads one document per event in the chosen
 *   range (Spark allows 50,000 reads/day).
 */
import { firebaseEnabled, getDb } from './firebase'

export const CONSENT_KEY = 'isoe:analytics-consent'
export type StatEventType = 'pageview' | 'form_start' | 'form_submit'

export function hasConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null') === 'granted'
  } catch {
    return false
  }
}

const today = () => new Date().toISOString().slice(0, 10)

function device(): 'mobile' | 'tablet' | 'desktop' {
  const w = Math.min(window.screen?.width ?? window.innerWidth, window.innerWidth)
  const coarse = window.matchMedia('(pointer: coarse)').matches
  if (coarse && w < 768) return 'mobile'
  if (coarse && w < 1280) return 'tablet'
  return 'desktop'
}

let firstInSession = true
function referrer(): string | null {
  if (!firstInSession) return null
  firstInSession = false
  try {
    if (sessionStorage.getItem('isoe:ref-sent')) return null
    sessionStorage.setItem('isoe:ref-sent', '1')
  } catch {
    /* ignore */
  }
  if (!document.referrer) return 'direct'
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '')
    return host === location.hostname.replace(/^www\./, '') ? null : host.slice(0, 80)
  } catch {
    return 'direct'
  }
}

function newVisitorToday() {
  try {
    if (localStorage.getItem('isoe:last-visit') === today()) return false
    localStorage.setItem('isoe:last-visit', today())
    return true
  } catch {
    return false
  }
}

async function write(type: StatEventType, extra: { path?: string; design?: string | null; inquiryType?: string | null } = {}) {
  if (!firebaseEnabled || !hasConsent()) return
  try {
    const db = await getDb()
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
    const path = (extra.path ?? location.pathname).slice(0, 120)
    await addDoc(collection(db, 'events'), {
      type,
      path,
      design: extra.design ?? (path.match(/^\/designs\/([a-z-]+)/)?.[1] ?? null),
      inquiryType: extra.inquiryType ?? null,
      device: device(),
      referrer: type === 'pageview' ? referrer() : null,
      newVisitor: type === 'pageview' ? newVisitorToday() : false,
      day: today(),
      createdAt: serverTimestamp(),
    })
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[stats]', e)
  }
}

export const trackPageview = (path: string) => write('pageview', { path })
let started = false
export const trackFormStart = () => {
  if (started) return
  started = true
  void write('form_start', { path: '/book-a-site-visit' })
}
export const trackFormSubmit = (inquiryType: string) => {
  started = false
  void write('form_submit', { path: '/book-a-site-visit', inquiryType })
}
