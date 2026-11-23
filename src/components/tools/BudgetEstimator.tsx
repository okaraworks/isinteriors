import { useId, useMemo, useState } from 'react'
import { site } from '../../config/site'
import { designFeeShare, finishes, projectTypes, rangeSpread, scopes, SQFT_PER_SQM } from '../../data/budget'
import { ButtonLink } from '../ui/Button'

const fmt = new Intl.NumberFormat(site.currency.locale, { style: 'currency', currency: site.currency.code, maximumFractionDigits: 0 })
const round = (n: number) => Math.round(n / 1000) * 1000

function Choice<T extends string>({ legend, value, onChange, options }: { legend: string; value: T; onChange: (v: T) => void; options: readonly { id: T; label: string; note?: string }[] }) {
  const name = useId()
  return (
    <fieldset>
      <legend className="eyebrow mb-4">{legend}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <label key={o.id} className={`relative flex cursor-pointer flex-col border px-4 py-3 transition-colors ${value === o.id ? 'border-espresso bg-white' : 'border-line hover:border-espresso/50'}`}>
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            <span className="text-sm font-medium">{o.label}</span>
            {o.note && <span className="mt-1 text-xs leading-snug text-ink-soft">{o.note}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function BudgetEstimator() {
  const [type, setType] = useState<(typeof projectTypes)[number]['id']>('residential')
  const [scope, setScope] = useState<(typeof scopes)[number]['id']>('refresh')
  const [finish, setFinish] = useState<(typeof finishes)[number]['id']>('premium')
  const [unit, setUnit] = useState<'sqm' | 'sqft'>('sqm')
  const [area, setArea] = useState(120)
  const areaId = useId()

  const sqm = unit === 'sqm' ? area : area / SQFT_PER_SQM
  const est = useMemo(() => {
    const t = projectTypes.find((x) => x.id === type)!
    const s = scopes.find((x) => x.id === scope)!
    const f = finishes.find((x) => x.id === finish)!
    const mid = sqm * s.rate * t.factor * f.factor
    const low = mid * (1 - rangeSpread)
    const high = mid * (1 + rangeSpread)
    return {
      low: round(low),
      high: round(high),
      feeLow: round(low * designFeeShare.low),
      feeHigh: round(high * designFeeShare.high),
    }
  }, [type, scope, finish, sqm])

  const maxArea = unit === 'sqm' ? 1500 : 16000
  const minArea = unit === 'sqm' ? 10 : 100
  const switchUnit = (u: 'sqm' | 'sqft') => {
    if (u === unit) return
    setArea(Math.round(u === 'sqft' ? area * SQFT_PER_SQM : area / SQFT_PER_SQM))
    setUnit(u)
  }

  const summary = `${projectTypes.find((x) => x.id === type)!.label}, ${Math.round(area)} ${unit === 'sqm' ? 'm²' : 'sq ft'}, ${scopes.find((x) => x.id === scope)!.label}, ${finishes.find((x) => x.id === finish)!.label} finish. Indicative ${fmt.format(est.low)}–${fmt.format(est.high)}`

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <form className="space-y-10 lg:col-span-7" onSubmit={(e) => e.preventDefault()} aria-label="Project budget estimator">
        <Choice legend="Project type" value={type} onChange={setType} options={projectTypes} />

        <fieldset>
          <div className="mb-4 flex items-center justify-between">
            <legend className="eyebrow">Floor area</legend>
            <div className="flex border border-line text-[0.65rem] font-semibold uppercase tracking-[0.15em]" role="group" aria-label="Units">
              {(['sqm', 'sqft'] as const).map((u) => (
                <button key={u} type="button" aria-pressed={unit === u} onClick={() => switchUnit(u)} className={`px-3 py-1.5 ${unit === u ? 'bg-espresso text-ivory' : ''}`}>
                  {u === 'sqm' ? 'm²' : 'sq ft'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <input
              id={areaId}
              type="range"
              min={minArea}
              max={maxArea}
              step={unit === 'sqm' ? 5 : 50}
              value={Math.min(area, maxArea)}
              onChange={(e) => setArea(Number(e.target.value))}
              className="h-px flex-1 cursor-pointer appearance-none bg-espresso/30 accent-espresso"
              aria-label="Floor area"
            />
            <label className="flex w-32 items-baseline gap-2 border-b border-espresso/30">
              <span className="sr-only">Floor area value</span>
              <input
                type="number"
                inputMode="numeric"
                min={minArea}
                max={maxArea * 3}
                value={Math.round(area)}
                onChange={(e) => setArea(Math.max(0, Number(e.target.value) || 0))}
                className="w-full bg-transparent py-1 font-display text-3xl outline-none"
              />
              <span className="text-xs text-ink-soft">{unit === 'sqm' ? 'm²' : 'sq ft'}</span>
            </label>
          </div>
        </fieldset>

        <Choice legend="Scope" value={scope} onChange={setScope} options={scopes} />
        <Choice legend="Finish level" value={finish} onChange={setFinish} options={finishes} />
      </form>

      <aside className="lg:col-span-5" aria-live="polite" aria-label="Estimate">
        <div className="sticky top-28 bg-espresso p-8 text-ivory sm:p-10">
          <p className="eyebrow text-beige">Indicative investment</p>
          <p className="mt-6 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-none">
            {fmt.format(est.low)}
            <span className="block text-taupe">– {fmt.format(est.high)}</span>
          </p>
          <dl className="mt-8 space-y-3 border-t border-ivory/15 pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ivory/70">Build, finishes &amp; furnishing</dt>
              <dd>
                {fmt.format(est.low)} – {fmt.format(est.high)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ivory/70">Typical design fee</dt>
              <dd>
                {fmt.format(est.feeLow)} – {fmt.format(est.feeHigh)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ivory/70">Area</dt>
              <dd>{Math.round(sqm)} m²</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-ivory/60">
            A starting guide only, based on placeholder rates. Your actual budget depends on site conditions, specification and location, and is
            confirmed after a site visit.
          </p>
          <ButtonLink to={`/book-a-site-visit?estimate=${encodeURIComponent(summary)}`} variant="light" className="mt-8 w-full">
            Start Your Project
          </ButtonLink>
        </div>
      </aside>
    </div>
  )
}
