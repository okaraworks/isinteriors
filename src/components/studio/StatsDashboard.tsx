import { useState } from 'react'
import type { Ranked, StatsSummary } from '../../lib/statsAggregate'

const nf = new Intl.NumberFormat('en-US')
const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : '–')
const shortDay = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

function Kpi({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-ivory p-6">
      <p className="eyebrow">{label}</p>
      <p className="mt-4 font-display text-5xl leading-none">{value}</p>
      {note && <p className="mt-3 text-xs text-ink-soft">{note}</p>}
    </div>
  )
}

/** Views per day: single series, bars with rounded data-ends and a hover tooltip. */
function DailyChart({ days }: { days: StatsSummary['days'] }) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(1, ...days.map((d) => d.views))
  const nice = Math.ceil(max / 10) * 10
  const W = 1000
  const H = 260
  const padL = 40
  const padB = 28
  const bw = (W - padL) / days.length
  const ticks = [0, nice / 2, nice]
  const h = hover !== null ? days[hover] : null
  return (
    <figure className="border border-line bg-white p-5 sm:p-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="eyebrow !text-espresso">Page views per day</span>
        <span className="text-xs text-ink-soft">Hover a bar for visitors and inquiries</span>
      </figcaption>
      <div className="relative mt-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Page views per day, peak ${max}`} onMouseLeave={() => setHover(null)}>
          {ticks.map((t) => {
            const y = H - padB - (t / nice) * (H - padB - 10)
            return (
              <g key={t}>
                <line x1={padL} x2={W} y1={y} y2={y} stroke="rgb(69 56 47 / 0.1)" />
                <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="rgb(69 56 47 / 0.6)">
                  {t}
                </text>
              </g>
            )
          })}
          {days.map((d, i) => {
            const bh = (d.views / nice) * (H - padB - 10)
            const x = padL + i * bw + Math.max(1, bw * 0.14)
            const w = Math.max(2, bw * 0.72)
            const y = H - padB - bh
            return (
              <g key={d.day} onMouseEnter={() => setHover(i)}>
                <rect x={padL + i * bw} y={0} width={bw} height={H - padB} fill="transparent" />
                {bh > 0 && <path d={`M${x} ${H - padB} V${y + Math.min(4, bh)} Q${x} ${y} ${x + Math.min(4, w / 2)} ${y} H${x + w - Math.min(4, w / 2)} Q${x + w} ${y} ${x + w} ${y + Math.min(4, bh)} V${H - padB} Z`} fill={hover === i ? '#8A6A4A' : '#45382F'} />}
                {(i === 0 || i === days.length - 1 || (days.length > 10 && i % Math.ceil(days.length / 6) === 0)) && (
                  <text x={padL + i * bw + bw / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="rgb(69 56 47 / 0.6)">
                    {shortDay(d.day)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
        {h && hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 border border-line bg-ivory px-3 py-2 text-xs shadow-[0_10px_30px_-18px_rgba(69,56,47,0.6)]"
            style={{ left: `${((padL + hover * bw + bw / 2) / W) * 100}%` }}
          >
            <p className="font-semibold">{shortDay(h.day)}</p>
            <p>{h.views} views</p>
            <p>{h.visitors} visitors</p>
            <p>{h.inquiries} inquiries</p>
          </div>
        )}
      </div>
    </figure>
  )
}

function RankList({ title, items, empty = 'No data yet', total }: { title: string; items: Ranked[]; empty?: string; total?: number }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  const sum = total ?? items.reduce((s, i) => s + i.value, 0)
  return (
    <section className="border border-line bg-white p-5 sm:p-6" aria-label={title}>
      <h3 className="eyebrow !text-espresso">{title}</h3>
      {items.length === 0 || sum === 0 ? (
        <p className="mt-6 text-sm text-ink-soft">{empty}</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((i) => (
            <li key={i.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 text-sm">
              <span className="truncate">{i.label}</span>
              <span className="tabular-nums text-ink-soft">
                {nf.format(i.value)} <span className="text-xs">({pct(i.value, sum)})</span>
              </span>
              <span className="col-span-2 h-1.5 bg-beige/70">
                <span className="block h-full rounded-r-[2px] bg-taupe" style={{ width: `${(i.value / max) * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export const RANGES = [7, 30, 90] as const

export function StatsDashboard({ data, range, onRange, loading, sample }: { data: StatsSummary; range: number; onRange: (n: (typeof RANGES)[number]) => void; loading?: boolean; sample?: boolean }) {
  const [table, setTable] = useState(false)
  return (
    <div className={`space-y-6 transition-opacity ${loading ? 'opacity-50' : ''}`} aria-busy={loading}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex border border-line text-[0.68rem] font-semibold uppercase tracking-[0.18em]" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button key={r} type="button" aria-pressed={range === r} onClick={() => onRange(r)} className={`px-4 py-2 ${range === r ? 'bg-espresso text-ivory' : 'hover:bg-beige/60'}`}>
              {r} days
            </button>
          ))}
        </div>
        {sample && <span className="border border-dashed border-taupe px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-taupe">Sample data</span>}
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Page views" value={nf.format(data.views)} />
        <Kpi label="Visitors" value={nf.format(data.visitors)} note="Unique per browser per day" />
        <Kpi label="Inquiries" value={nf.format(data.inquiries)} />
        <Kpi label="Visitor → inquiry" value={pct(data.inquiries, data.visitors)} note="Inquiries ÷ visitors" />
        <Kpi label="Form completion" value={pct(data.formSubmits, data.formStarts)} note={`${data.formSubmits} sent of ${data.formStarts} started`} />
      </div>

      <DailyChart days={data.days} />
      <button type="button" className="link-underline text-xs uppercase tracking-[0.18em] text-ink-soft" onClick={() => setTable((t) => !t)} aria-expanded={table}>
        {table ? 'Hide' : 'Show'} daily table
      </button>
      {table && (
        <div className="max-h-80 overflow-auto border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-ivory text-left text-xs uppercase tracking-[0.15em] text-ink-soft">
              <tr>
                <th className="px-4 py-2 font-semibold">Day</th>
                <th className="px-4 py-2 text-right font-semibold">Views</th>
                <th className="px-4 py-2 text-right font-semibold">Visitors</th>
                <th className="px-4 py-2 text-right font-semibold">Inquiries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line tabular-nums">
              {[...data.days].reverse().map((d) => (
                <tr key={d.day}>
                  <td className="px-4 py-1.5">{d.day}</td>
                  <td className="px-4 py-1.5 text-right">{d.views}</td>
                  <td className="px-4 py-1.5 text-right">{d.visitors}</td>
                  <td className="px-4 py-1.5 text-right">{d.inquiries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <RankList title="Top pages" items={data.topPages} />
        <RankList title="Most viewed designs" items={data.topDesigns} />
        <RankList title="Inquiries by type" items={data.inquiryTypes} empty="No inquiries in this range" />
        <RankList title="Inquiries by status" items={data.inquiryStatuses} empty="No inquiries in this range" />
        <RankList title="Devices (visitors)" items={data.devices} />
        <RankList title="Referrers (first page of a visit)" items={data.referrers} />
      </div>
      <p className="text-xs text-ink-soft">
        Counts only visitors who accepted analytics, so totals are lower than true traffic. Each page view costs one Firestore write; loading this dashboard reads one document per event in
        the range (free plan: 20,000 writes and 50,000 reads per day).
      </p>
    </div>
  )
}
