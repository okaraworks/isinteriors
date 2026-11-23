import { useId, useState } from 'react'
import type { RoomKind } from '../art/RoomScene'
import { Artwork } from '../ui/Artwork'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const transformations: { label: string; room: RoomKind; conceptSlug: string; note: string }[] = [
  { label: 'Living room', room: 'living', conceptSlug: 'quiet-ivory', note: 'Bare shell to a tonal, light-filled living room in Quiet Ivory.' },
  { label: 'Kitchen', room: 'kitchen', conceptSlug: 'riviera-limestone', note: 'An unfinished space resolved around a solid travertine island.' },
  { label: 'Principal suite', room: 'bedroom', conceptSlug: 'atelier-japandi', note: 'A plain room given an ash headboard wall and layered light.' },
]

export function BeforeAfter() {
  const [pos, setPos] = useState(50)
  const [i, setI] = useState(0)
  const t = transformations[i]
  const inputId = useId()

  return (
    <section aria-labelledby="ba-title" className="bg-espresso py-28 text-ivory sm:py-36">
      <div className="container-editorial">
        <SectionHeading
          index="05"
          eyebrow="Transformation"
          id="ba-title"
          tone="light"
          title={
            <>
              Before, <em className="text-taupe">and after.</em>
            </>
          }
          intro="Drag the divider, or focus it and use your arrow keys, to see how a space changes from bare shell to finished room."
        />

        <div className="mt-12 flex flex-wrap gap-3" role="group" aria-label="Choose a transformation">
          {transformations.map((x, idx) => (
            <button
              key={x.label}
              type="button"
              aria-pressed={i === idx}
              onClick={() => setI(idx)}
              className={`border px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-colors ${
                i === idx ? 'border-ivory bg-ivory text-espresso' : 'border-ivory/30 text-ivory/80 hover:border-ivory'
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>

        <Reveal className="mt-8">
          <div className="relative aspect-[4/3] select-none overflow-hidden sm:aspect-[16/9]">
            <Artwork key={`a-${i}`} conceptSlug={t.conceptSlug} room={t.room} alt={`After: ${t.label} finished`} zoom={false} className="absolute inset-0" />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Artwork key={`b-${i}`} conceptSlug={t.conceptSlug} room={t.room} state="before" alt={`Before: ${t.label} unfinished`} zoom={false} className="absolute inset-0" />
            </div>

            <span className="pointer-events-none absolute left-4 top-4 bg-espresso/80 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-ivory">Before</span>
            <span className="pointer-events-none absolute right-4 top-4 bg-ivory/90 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-espresso">After</span>

            <div className="pointer-events-none absolute inset-y-0 w-px bg-ivory" style={{ left: `${pos}%` }}>
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory bg-espresso/40 text-sm text-ivory backdrop-blur-sm">
                ⟷
              </span>
            </div>

            <label htmlFor={inputId} className="sr-only">
              Reveal before and after, {t.label}
            </label>
            <input
              id={inputId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-valuetext={`${pos}% before shown`}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>
          <p className="mt-5 text-sm text-ivory/70">{t.note} Illustrative visualisation.</p>
        </Reveal>
      </div>
    </section>
  )
}
