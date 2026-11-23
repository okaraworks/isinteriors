import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { concepts, conceptBySlug } from '../../data/concepts'
import { allMoodItems, moodLibrary, type MoodItem } from '../../data/moodboard'
import { safeStorage } from '../../lib/storage'
import { MaterialSwatch } from '../art/MaterialSwatch'
import { RoomScene } from '../art/RoomScene'
import { isDark } from '../../lib/color'
import { ButtonLink } from '../ui/Button'

const MAX = 9
const KEY = 'isoe:moodboard'

function itemColour(i: MoodItem) {
  if (i.kind === 'colour') return i.hex
  if (i.kind === 'material') return i.color
  return conceptBySlug(i.conceptSlug)?.scene.wall ?? '#E9DFD1'
}

function dist(a: string, b: string) {
  const p = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16))
  const [x, y] = [p(a), p(b)]
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2])
}

export function MoodTile({ item, className = '', label = true }: { item: MoodItem; className?: string; label?: boolean }) {
  if (item.kind === 'colour')
    return (
      <div className={`flex items-end p-3 ${className}`} style={{ background: item.hex }}>
        {label && <span className={`text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${isDark(item.hex) ? 'text-ivory' : 'text-espresso'}`}>
          {item.label}
          <span className="ml-2 opacity-60">{item.hex}</span>
        </span>}
      </div>
    )
  if (item.kind === 'material') return <MaterialSwatch texture={item.texture} color={item.color} className={className} title={item.label} />
  const c = conceptBySlug(item.conceptSlug)!
  return <RoomScene room={item.room} palette={c.scene} seed={c.seed} className={className} title={item.label} />
}

export function MoodboardBuilder() {
  const [group, setGroup] = useState(0)
  const [ids, setIds] = useState<string[]>(() => safeStorage.get<string[]>(KEY, ['c-ivory', 'm-travertine', 's-living', 'm-oak', 'c-taupe']))
  const [name, setName] = useState(() => safeStorage.get<string>(`${KEY}:name`, 'My moodboard'))

  useEffect(() => safeStorage.set(KEY, ids), [ids])
  useEffect(() => safeStorage.set(`${KEY}:name`, name), [name])

  const selected = ids.map((id) => allMoodItems.find((i) => i.id === id)).filter(Boolean) as MoodItem[]
  const toggle = (id: string) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= MAX ? cur : [...cur, id]))

  const match = useMemo(() => {
    if (!selected.length) return null
    const cols = selected.map(itemColour)
    return concepts
      .map((c) => {
        const ref = [...c.palette.map((s) => s.hex), ...c.materials.map((m) => m.color)]
        return { c, d: cols.reduce((sum, col) => sum + Math.min(...ref.map((r) => dist(col, r))), 0) / cols.length }
      })
      .sort((a, b) => a.d - b.d)[0].c
  }, [selected])

  const share = `/book-a-site-visit?type=consultation&moodboard=${encodeURIComponent(ids.join(','))}`

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div role="tablist" aria-label="Moodboard library" className="flex gap-6 border-b border-line">
          {moodLibrary.map((g, i) => (
            <button
              key={g.group}
              role="tab"
              aria-selected={group === i}
              onClick={() => setGroup(i)}
              className={`relative -mb-px pb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${group === i ? 'text-espresso' : 'text-ink-soft'}`}
            >
              {g.group}
              {group === i && <motion.span layoutId="mood-tab" className="absolute inset-x-0 bottom-0 h-px bg-espresso" />}
            </button>
          ))}
        </div>
        <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4" role="tabpanel" aria-label={moodLibrary[group].group}>
          {moodLibrary[group].items.map((item) => {
            const on = ids.includes(item.id)
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(item.id)}
                  disabled={!on && ids.length >= MAX}
                  className="group relative block w-full text-left disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className={`relative block aspect-square overflow-hidden ${on ? 'outline outline-1 outline-offset-2 outline-espresso' : 'outline-none'}`}>
                    <MoodTile item={item} label={false} className="absolute inset-0 h-full w-full" />
                    <span className={`absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] transition ${on ? 'bg-espresso text-ivory' : 'bg-ivory/80 text-espresso opacity-0 group-hover:opacity-100'}`}>
                      {on ? '✓' : '+'}
                    </span>
                  </span>
                  <span className="mt-1.5 block truncate text-[0.7rem] text-ink-soft">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-5 text-xs text-ink-soft">
          {ids.length} of {MAX} selected. Your board is saved on this device.
        </p>
      </div>

      <div className="lg:col-span-7">
        <div className="border border-line bg-white p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <label className="flex-1">
              <span className="sr-only">Moodboard name</span>
              <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent font-display text-2xl outline-none sm:text-3xl" />
            </label>
            <button type="button" onClick={() => setIds([])} className="link-underline text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-soft" disabled={!ids.length}>
              Clear
            </button>
          </div>
          <div className="mt-4 grid aspect-[4/3] grid-flow-dense grid-cols-4 grid-rows-3 gap-2">
            <AnimatePresence>
              {selected.map((item, i) => (
                <motion.button
                  key={item.id}
                  layout
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-label={`Remove ${item.label} from board`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                >
                  <MoodTile item={item} className="absolute inset-0 h-full w-full" />
                  <span className="absolute inset-0 flex items-center justify-center bg-espresso/0 text-xs font-semibold uppercase tracking-[0.2em] text-ivory opacity-0 transition group-hover:bg-espresso/50 group-hover:opacity-100">
                    Remove
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
            {selected.length === 0 && (
              <p className="col-span-4 row-span-3 flex items-center justify-center border border-dashed border-line text-center text-sm text-ink-soft">
                Choose colours, materials and spaces to begin your board.
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          {match ? (
            <p className="text-sm text-ink-soft">
              Closest studio collection:{' '}
              <Link to={`/designs/${match.slug}`} className="link-underline font-medium text-espresso">
                {match.name}
              </Link>
            </p>
          ) : (
            <span />
          )}
          <ButtonLink to={share} aria-disabled={!ids.length} className={!ids.length ? 'pointer-events-none opacity-50' : ''}>
            Send board with consultation
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
