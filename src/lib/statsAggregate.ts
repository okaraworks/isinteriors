import { concepts } from '../data/concepts'
import { seeded } from './color'

export interface StatEvent {
  type: 'pageview' | 'form_start' | 'form_submit'
  path: string
  design: string | null
  inquiryType: string | null
  device: 'mobile' | 'tablet' | 'desktop'
  referrer: string | null
  newVisitor: boolean
  day: string
}

export interface InquiryLite {
  type: string
  status: string
  day: string
}

export interface Ranked {
  key: string
  label: string
  value: number
}

export interface StatsSummary {
  days: { day: string; views: number; visitors: number; inquiries: number }[]
  views: number
  visitors: number
  inquiries: number
  formStarts: number
  formSubmits: number
  topPages: Ranked[]
  topDesigns: Ranked[]
  devices: Ranked[]
  referrers: Ranked[]
  inquiryTypes: Ranked[]
  inquiryStatuses: Ranked[]
}

export function dayList(n: number) {
  const out: string[] = []
  const d = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - i))
    out.push(x.toISOString().slice(0, 10))
  }
  return out
}

const pageLabel = (p: string) => {
  if (p === '/') return 'Home'
  const design = p.match(/^\/designs\/([a-z-]+)/)?.[1]
  if (design) return `Design · ${concepts.find((c) => c.slug === design)?.name ?? design}`
  const map: Record<string, string> = {
    '/designs': 'Designs',
    '/services': 'Services',
    '/projects': 'Projects',
    '/book-a-site-visit': 'Book a site visit',
    '/privacy': 'Privacy',
  }
  return map[p] ?? p
}

function rank(counts: Map<string, number>, label: (k: string) => string = (k) => k, limit = 10): Ranked[] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, label: label(key), value }))
}

const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1)

export function aggregate(events: StatEvent[], inquiries: InquiryLite[], nDays: number): StatsSummary {
  const days = dayList(nDays)
  const byDay = new Map(days.map((d) => [d, { day: d, views: 0, visitors: 0, inquiries: 0 }]))
  const pages = new Map<string, number>()
  const designs = new Map<string, number>()
  const devices = new Map<string, number>()
  const referrers = new Map<string, number>()
  let formStarts = 0
  let formSubmits = 0

  for (const e of events) {
    const d = byDay.get(e.day)
    if (!d) continue
    if (e.type === 'pageview') {
      d.views++
      if (e.newVisitor) {
        d.visitors++
        bump(devices, e.device)
      }
      bump(pages, e.path)
      if (e.design) bump(designs, e.design)
      if (e.referrer) bump(referrers, e.referrer)
    } else if (e.type === 'form_start') formStarts++
    else if (e.type === 'form_submit') formSubmits++
  }

  const types = new Map<string, number>()
  const statuses = new Map<string, number>()
  let inquiryCount = 0
  for (const q of inquiries) {
    const d = byDay.get(q.day)
    if (!d) continue
    d.inquiries++
    inquiryCount++
    bump(types, q.type)
    bump(statuses, q.status)
  }

  const series = [...byDay.values()]
  return {
    days: series,
    views: series.reduce((s, d) => s + d.views, 0),
    visitors: series.reduce((s, d) => s + d.visitors, 0),
    inquiries: inquiryCount,
    formStarts,
    formSubmits,
    topPages: rank(pages, pageLabel, 8),
    topDesigns: rank(designs, (k) => concepts.find((c) => c.slug === k)?.name ?? k, 8),
    devices: rank(devices, (k) => k[0].toUpperCase() + k.slice(1)),
    referrers: rank(referrers, (k) => (k === 'direct' ? 'Direct / none' : k), 8),
    inquiryTypes: ['site-visit', 'consultation'].map((k) => ({ key: k, label: k === 'site-visit' ? 'Site visits' : 'Consultations', value: types.get(k) ?? 0 })),
    inquiryStatuses: ['new', 'contacted', 'scheduled', 'closed'].map((k) => ({ key: k, label: k[0].toUpperCase() + k.slice(1), value: statuses.get(k) ?? 0 })),
  }
}

/** Deterministic SAMPLE data, only for previewing the dashboard before Firebase is connected. */
export function sampleData(nDays: number): { events: StatEvent[]; inquiries: InquiryLite[] } {
  const r = seeded(42)
  const events: StatEvent[] = []
  const inquiries: InquiryLite[] = []
  const paths = ['/', '/', '/', '/designs', '/services', '/projects', '/book-a-site-visit', ...concepts.map((c) => `/designs/${c.slug}`)]
  const refs = ['direct', 'direct', 'google.com', 'google.com', 'instagram.com', 'pinterest.com', 'houzz.com']
  const devs: StatEvent['device'][] = ['mobile', 'mobile', 'mobile', 'desktop', 'desktop', 'tablet']
  dayList(nDays).forEach((day, i) => {
    const weekend = new Date(day).getUTCDay() % 6 === 0
    const visitors = Math.round((weekend ? 18 : 30) + i * 0.4 + r() * 14)
    for (let v = 0; v < visitors; v++) {
      const device = devs[Math.floor(r() * devs.length)]
      const pv = 1 + Math.floor(r() * 4)
      for (let k = 0; k < pv; k++) {
        const path = k === 0 ? '/' : paths[Math.floor(r() * paths.length)]
        events.push({ type: 'pageview', path, design: path.match(/^\/designs\/([a-z-]+)/)?.[1] ?? null, inquiryType: null, device, referrer: k === 0 ? refs[Math.floor(r() * refs.length)] : null, newVisitor: k === 0, day })
      }
      if (r() < 0.08) {
        events.push({ type: 'form_start', path: '/book-a-site-visit', design: null, inquiryType: null, device, referrer: null, newVisitor: false, day })
        if (r() < 0.45) {
          const type = r() < 0.6 ? 'site-visit' : 'consultation'
          events.push({ type: 'form_submit', path: '/book-a-site-visit', design: null, inquiryType: type, device, referrer: null, newVisitor: false, day })
          inquiries.push({ type, status: ['new', 'contacted', 'scheduled', 'closed'][Math.floor(r() * 4)], day })
        }
      }
    }
  })
  return { events, inquiries }
}
