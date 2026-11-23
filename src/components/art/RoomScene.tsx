/**
 * RoomScene — illustrated, art-directed placeholder interiors.
 *
 * These are vector "architectural renders" drawn in one-point perspective so the
 * site has cohesive, on-palette imagery until the studio's own photography is
 * supplied. They are tiny (no network requests), crisp at any size and themed
 * from each design concept's palette. Swap for real photos via the `src` prop
 * on <Artwork />.
 */
import { memo, useId, type ReactNode } from 'react'
import { darken, lighten, mix, seeded } from '../../lib/color'

export type RoomKind = 'living' | 'bedroom' | 'kitchen' | 'dining' | 'lobby' | 'office' | 'bath' | 'vignette'
export type FloorKind = 'oak' | 'stone' | 'concrete' | 'terrazzo'
export type OpeningKind = 'arch' | 'window' | 'grid' | 'slats'

export interface ScenePalette {
  wall: string
  floor: string
  wood: string
  fabric: string
  accent: string
  dark: string
  stone: string
  sky: string
  plant: string
}

export interface SceneProps {
  room: RoomKind
  palette: ScenePalette
  floor?: FloorKind
  opening?: OpeningKind
  /** "before" draws the same room bare and unfinished, for the before/after slider. */
  state?: 'before' | 'after'
  seed?: number
  /** Accessible description; omit for decorative use. */
  title?: string
  className?: string
}

// Geometry: back wall in a 1600×1200 canvas, vanishing point at (800, 460).
const VX = 800
const VY = 460
const W0 = 260
const W1 = 1340
const C0 = 120
const F0 = 800
const K = 2.18 // depth multiplier reaching the canvas edge

/** Project a point drawn on the back-wall plane to depth t (t = 1 is the wall, larger is nearer). */
const P = (x: number, y: number, t: number) => `${VX + (x - VX) * t},${VY + (y - VY) * t}`
const depth = (t: number) => `matrix(${t} 0 0 ${t} ${VX * (1 - t)} ${VY * (1 - t)})`

function Depth({ t, children }: { t: number; children: ReactNode }) {
  return <g transform={depth(t)}>{children}</g>
}

interface BoxProps {
  x0: number
  x1: number
  top: number
  bottom?: number
  t0: number
  t1: number
  front: string
  topFill?: string
  sideFill?: string
  children?: ReactNode
}

/** Simple perspective box (tables, beds, islands, desks). */
function Box({ x0, x1, top, bottom = F0, t0, t1, front, topFill, sideFill }: BoxProps) {
  const tf = topFill ?? lighten(front, 0.18)
  const sf = sideFill ?? darken(front, 0.12)
  return (
    <g>
      {x1 < VX && <polygon points={`${P(x1, top, t0)} ${P(x1, top, t1)} ${P(x1, bottom, t1)} ${P(x1, bottom, t0)}`} fill={sf} />}
      {x0 > VX && <polygon points={`${P(x0, top, t0)} ${P(x0, top, t1)} ${P(x0, bottom, t1)} ${P(x0, bottom, t0)}`} fill={sf} />}
      {top > VY && <polygon points={`${P(x0, top, t0)} ${P(x1, top, t0)} ${P(x1, top, t1)} ${P(x0, top, t1)}`} fill={tf} />}
      <polygon points={`${P(x0, top, t1)} ${P(x1, top, t1)} ${P(x1, bottom, t1)} ${P(x0, bottom, t1)}`} fill={front} />
    </g>
  )
}

function Shadow({ cx, cy, rx, ry, id, o = 1 }: { cx: number; cy: number; rx: number; ry: number; id: string; o?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-shadow)`} opacity={o} />
}

// ─── Furniture, drawn on the back-wall plane (floor at y = 800) ─────────────

function Sofa({ cx, w, p }: { cx: number; w: number; p: ScenePalette }) {
  const x = cx - w / 2
  const fs = darken(p.fabric, 0.1)
  return (
    <g>
      <rect x={x + 30} y={F0 - 14} width={w - 60} height={14} fill={darken(p.wood, 0.25)} />
      <rect x={x + 20} y={F0 - 205} width={w - 40} height={130} rx={22} fill={fs} />
      <rect x={x + 60} y={F0 - 190} width={(w - 120) / 2 - 6} height={100} rx={20} fill={lighten(p.fabric, 0.06)} />
      <rect x={cx + 6} y={F0 - 190} width={(w - 120) / 2 - 6} height={100} rx={20} fill={lighten(p.fabric, 0.06)} />
      <rect x={x} y={F0 - 112} width={w} height={100} rx={18} fill={p.fabric} />
      <rect x={x + 58} y={F0 - 118} width={w - 116} height={28} rx={12} fill={lighten(p.fabric, 0.1)} />
      <rect x={x - 6} y={F0 - 150} width={74} height={140} rx={30} fill={p.fabric} />
      <rect x={x + w - 68} y={F0 - 150} width={74} height={140} rx={30} fill={p.fabric} />
      <rect x={x + 82} y={F0 - 178} width={92} height={78} rx={14} fill={p.accent} transform={`rotate(-6 ${x + 128} ${F0 - 140})`} />
      <rect x={x + w - 170} y={F0 - 172} width={84} height={72} rx={14} fill={mix(p.accent, p.fabric, 0.55)} transform={`rotate(5 ${x + w - 128} ${F0 - 136})`} />
    </g>
  )
}

function LoungeChair({ cx, p, flip = false }: { cx: number; p: ScenePalette; flip?: boolean }) {
  return (
    <g transform={flip ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}>
      <path d={`M${cx - 120} ${F0 - 30} C${cx - 150} ${F0 - 210}, ${cx - 40} ${F0 - 260}, ${cx + 40} ${F0 - 230} C${cx + 120} ${F0 - 200}, ${cx + 130} ${F0 - 110}, ${cx + 110} ${F0 - 30} Z`} fill={darken(p.fabric, 0.05)} />
      <rect x={cx - 110} y={F0 - 110} width={210} height={84} rx={36} fill={lighten(p.fabric, 0.05)} />
      <rect x={cx - 92} y={F0 - 28} width={8} height={28} fill={p.dark} />
      <rect x={cx + 78} y={F0 - 28} width={8} height={28} fill={p.dark} />
    </g>
  )
}

function Plant({ cx, h, p, seed, pot }: { cx: number; h: number; p: ScenePalette; seed: number; pot: string }) {
  const r = seeded(seed)
  const leaves = Array.from({ length: 34 }, () => {
    const a = r() * Math.PI * 2
    const d = Math.sqrt(r())
    return {
      x: cx + Math.cos(a) * d * h * 0.32,
      y: F0 - 120 - h * 0.62 + Math.sin(a) * d * h * 0.3,
      rot: r() * 180,
      s: 0.6 + r() * 0.7,
      shade: r(),
    }
  })
  return (
    <g>
      <path d={`M${cx} ${F0 - 110} C${cx - 6} ${F0 - 200}, ${cx + 10} ${F0 - 260}, ${cx - 4} ${F0 - 110 - h * 0.6}`} stroke={darken(p.wood, 0.35)} strokeWidth={6} fill="none" />
      <path d={`M${cx} ${F0 - 180} C${cx + 30} ${F0 - 240}, ${cx + 50} ${F0 - 280}, ${cx + 70} ${F0 - 110 - h * 0.55}`} stroke={darken(p.wood, 0.35)} strokeWidth={4} fill="none" />
      {leaves.map((l, i) => (
        <ellipse key={i} cx={l.x} cy={l.y} rx={22 * l.s} ry={9 * l.s} transform={`rotate(${l.rot} ${l.x} ${l.y})`} fill={mix(darken(p.plant, 0.2), lighten(p.plant, 0.25), l.shade)} />
      ))}
      <path d={`M${cx - 62} ${F0 - 122} L${cx + 62} ${F0 - 122} L${cx + 50} ${F0} L${cx - 50} ${F0} Z`} fill={pot} />
      <rect x={cx - 66} y={F0 - 128} width={132} height={10} fill={lighten(pot, 0.1)} />
    </g>
  )
}

function Vase({ cx, base, p, tall = 1, color }: { cx: number; base: number; p: ScenePalette; tall?: number; color?: string }) {
  const c = color ?? p.stone
  const h = 120 * tall
  return (
    <g>
      <path d={`M${cx} ${base - h} C${cx + 30} ${base - h - 90}, ${cx + 60} ${base - h - 140}, ${cx + 90} ${base - h - 150}`} stroke={darken(p.wood, 0.35)} strokeWidth={2.5} fill="none" />
      <path d={`M${cx} ${base - h} C${cx - 20} ${base - h - 110}, ${cx - 50} ${base - h - 150}, ${cx - 70} ${base - h - 190}`} stroke={darken(p.wood, 0.35)} strokeWidth={2.5} fill="none" />
      {[0.3, 0.55, 0.8].map((k, i) => (
        <g key={i}>
          <ellipse cx={cx + 90 * k} cy={base - h - 150 * k + 6} rx={9} ry={5} fill={p.plant} transform={`rotate(-30 ${cx + 90 * k} ${base - h - 150 * k})`} />
          <ellipse cx={cx - 70 * k} cy={base - h - 190 * k + 6} rx={9} ry={5} fill={lighten(p.plant, 0.15)} transform={`rotate(30 ${cx - 70 * k} ${base - h - 190 * k})`} />
        </g>
      ))}
      <path d={`M${cx - 18} ${base - h} C${cx - 18} ${base - h * 0.6}, ${cx - 48} ${base - h * 0.5}, ${cx - 44} ${base - h * 0.2} C${cx - 40} ${base}, ${cx + 40} ${base}, ${cx + 44} ${base - h * 0.2} C${cx + 48} ${base - h * 0.5}, ${cx + 18} ${base - h * 0.6}, ${cx + 18} ${base - h} Z`} fill={c} />
    </g>
  )
}

function Pendant({ cx, y, p, kind = 'dome', size = 1 }: { cx: number; y: number; p: ScenePalette; kind?: 'dome' | 'globe' | 'cone'; size?: number }) {
  const s = size
  return (
    <g>
      <line x1={cx} y1={-400} x2={cx} y2={y} stroke={p.dark} strokeWidth={2} />
      {kind === 'dome' && <path d={`M${cx - 60 * s} ${y + 46 * s} C${cx - 60 * s} ${y - 8 * s}, ${cx + 60 * s} ${y - 8 * s}, ${cx + 60 * s} ${y + 46 * s} Z`} fill={p.accent} />}
      {kind === 'globe' && <circle cx={cx} cy={y + 34 * s} r={34 * s} fill={lighten(p.sky, 0.4)} stroke={lighten(p.accent, 0.3)} strokeWidth={2} />}
      {kind === 'cone' && <path d={`M${cx - 12 * s} ${y} L${cx + 12 * s} ${y} L${cx + 40 * s} ${y + 70 * s} L${cx - 40 * s} ${y + 70 * s} Z`} fill={p.dark} />}
      {kind !== 'globe' && <ellipse cx={cx} cy={y + (kind === 'cone' ? 70 : 46) * s} rx={(kind === 'cone' ? 40 : 60) * s} ry={6 * s} fill="#fff6e0" opacity={0.9} />}
    </g>
  )
}

function Art({ x, y, w, h, p, seed }: { x: number; y: number; w: number; h: number; p: ScenePalette; seed: number }) {
  const r = seeded(seed)
  const variant = Math.floor(r() * 3)
  return (
    <g>
      <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} fill={darken(p.wood, 0.2)} />
      <rect x={x} y={y} width={w} height={h} fill={lighten(p.wall, 0.35)} />
      {variant === 0 && (
        <>
          <circle cx={x + w * 0.42} cy={y + h * 0.44} r={Math.min(w, h) * 0.26} fill={p.accent} opacity={0.85} />
          <rect x={x + w * 0.18} y={y + h * 0.68} width={w * 0.64} height={3} fill={p.dark} />
        </>
      )}
      {variant === 1 && (
        <>
          <path d={`M${x} ${y + h * 0.7} C${x + w * 0.3} ${y + h * 0.45}, ${x + w * 0.6} ${y + h * 0.85}, ${x + w} ${y + h * 0.55} L${x + w} ${y + h} L${x} ${y + h} Z`} fill={mix(p.stone, p.dark, 0.25)} opacity={0.8} />
          <circle cx={x + w * 0.7} cy={y + h * 0.28} r={w * 0.08} fill={p.accent} />
        </>
      )}
      {variant === 2 && (
        <>
          <rect x={x + w * 0.2} y={y + h * 0.18} width={w * 0.34} height={h * 0.64} fill={p.accent} opacity={0.75} />
          <rect x={x + w * 0.46} y={y + h * 0.34} width={w * 0.34} height={h * 0.48} fill={p.dark} opacity={0.7} />
        </>
      )}
    </g>
  )
}

function Chair({ cx, p, back = false, scale = 1 }: { cx: number; p: ScenePalette; back?: boolean; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${F0}) scale(${scale}) translate(${-cx} ${-F0})`}>
      <rect x={cx - 40} y={F0 - 95} width={5} height={95} fill={darken(p.wood, 0.2)} />
      <rect x={cx + 35} y={F0 - 95} width={5} height={95} fill={darken(p.wood, 0.2)} />
      <rect x={cx - 48} y={F0 - 108} width={96} height={18} rx={6} fill={p.fabric} />
      <path d={`M${cx - 44} ${F0 - 100} L${cx - 40} ${F0 - (back ? 230 : 210)} Q${cx} ${F0 - (back ? 245 : 225)} ${cx + 40} ${F0 - (back ? 230 : 210)} L${cx + 44} ${F0 - 100} Z`} fill={back ? darken(p.fabric, 0.06) : p.wood} />
    </g>
  )
}

// ─── Openings ──────────────────────────────────────────────────────────────

function Opening({ kind, x, y, w, h, p, id }: { kind: OpeningKind; x: number; y: number; w: number; h: number; p: ScenePalette; id: string }) {
  const reveal = darken(p.wall, 0.12)
  if (kind === 'slats') {
    const n = Math.floor(w / 26)
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={darken(p.wood, 0.25)} />
        {Array.from({ length: n }, (_, i) => (
          <rect key={i} x={x + 4 + i * (w / n)} y={y} width={w / n - 8} height={h} fill={i % 2 ? p.wood : lighten(p.wood, 0.05)} />
        ))}
      </g>
    )
  }
  const archPath = `M${x} ${y + h} L${x} ${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L${x + w} ${y + h} Z`
  const shape = kind === 'arch' ? archPath : `M${x} ${y} H${x + w} V${y + h} H${x} Z`
  return (
    <g>
      <path d={shape} fill={`url(#${id}-sky)`} />
      {/* distant landscape */}
      <clipPath id={`${id}-clip-${x}`}>
        <path d={shape} />
      </clipPath>
      <g clipPath={`url(#${id}-clip-${x})`}>
        <path d={`M${x - 20} ${y + h * 0.72} C${x + w * 0.3} ${y + h * 0.62}, ${x + w * 0.6} ${y + h * 0.7}, ${x + w + 20} ${y + h * 0.6} L${x + w + 20} ${y + h} L${x - 20} ${y + h} Z`} fill={mix(p.plant, p.sky, 0.55)} />
        <path d={`M${x - 20} ${y + h * 0.82} C${x + w * 0.4} ${y + h * 0.76}, ${x + w * 0.7} ${y + h * 0.84}, ${x + w + 20} ${y + h * 0.78} L${x + w + 20} ${y + h} L${x - 20} ${y + h} Z`} fill={mix(p.plant, p.sky, 0.3)} />
        {/* inner reveal gives the wall thickness */}
        <path d={shape} fill="none" stroke={reveal} strokeWidth={kind === 'arch' ? 26 : 18} opacity={0.9} />
        {kind === 'window' && (
          <g stroke={p.dark} strokeWidth={5}>
            <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} />
            <line x1={x} y1={y + h * 0.38} x2={x + w} y2={y + h * 0.38} />
          </g>
        )}
        {kind === 'grid' && (
          <g stroke={p.dark} strokeWidth={4}>
            {Array.from({ length: 3 }, (_, i) => <line key={`v${i}`} x1={x + ((i + 1) * w) / 4} y1={y} x2={x + ((i + 1) * w) / 4} y2={y + h} />)}
            {Array.from({ length: 2 }, (_, i) => <line key={`h${i}`} x1={x} y1={y + ((i + 1) * h) / 3} x2={x + w} y2={y + ((i + 1) * h) / 3} />)}
            <rect x={x} y={y} width={w} height={h} fill="none" strokeWidth={8} />
          </g>
        )}
      </g>
    </g>
  )
}

// ─── Floors ────────────────────────────────────────────────────────────────

function FloorPattern({ kind, p, seed }: { kind: FloorKind; p: ScenePalette; seed: number }) {
  const line = darken(p.floor, 0.14)
  const xs = (n: number) => Array.from({ length: n + 1 }, (_, i) => W0 - 600 + (i * (W1 - W0 + 1200)) / n)
  if (kind === 'oak') {
    const r = seeded(seed)
    return (
      <g stroke={line} strokeWidth={1.4} opacity={0.8}>
        {xs(38).map((x, i) => (
          <line key={i} x1={x} y1={F0} x2={VX + (x - VX) * K} y2={VY + (F0 - VY) * K} />
        ))}
        {Array.from({ length: 70 }, (_, i) => {
          const x = W0 - 400 + r() * (W1 - W0 + 800)
          const t = 1 + r() * (K - 1)
          const y = VY + (F0 - VY) * t
          const xx = VX + (x - VX) * t
          return <line key={`s${i}`} x1={xx - 14 * t} y1={y} x2={xx + 14 * t} y2={y} />
        })}
      </g>
    )
  }
  if (kind === 'stone' || kind === 'terrazzo') {
    const ts = [1, 1.1, 1.23, 1.4, 1.62, 1.9, 2.2]
    const r = seeded(seed)
    return (
      <g>
        {kind === 'terrazzo' &&
          Array.from({ length: 260 }, (_, i) => {
            const t = 1 + r() * (K - 1)
            const x = VX + (W0 - 300 + r() * (W1 - W0 + 600) - VX) * t
            const y = VY + (F0 - VY) * t
            return <circle key={i} cx={x} cy={y} r={(1.2 + r() * 2.4) * t} fill={r() > 0.5 ? darken(p.floor, 0.25) : p.accent} opacity={0.55} />
          })}
        <g stroke={line} strokeWidth={1.4} opacity={kind === 'terrazzo' ? 0.4 : 0.9}>
          {xs(kind === 'terrazzo' ? 6 : 12).map((x, i) => (
            <line key={i} x1={x} y1={F0} x2={VX + (x - VX) * K} y2={VY + (F0 - VY) * K} />
          ))}
          {ts.map((t) => (
            <line key={t} x1={-400} y1={VY + (F0 - VY) * t} x2={2000} y2={VY + (F0 - VY) * t} />
          ))}
        </g>
      </g>
    )
  }
  return null
}

// ─── Room layouts ──────────────────────────────────────────────────────────

function LivingRoom({ p, id, seed, opening }: LayoutProps) {
  return (
    <g>
      <Opening kind={opening ?? 'arch'} x={340} y={250} w={300} h={F0 - 250} p={p} id={id} />
      <Art x={960} y={300} w={240} h={290} p={p} seed={seed} />
      <Depth t={1.02}>
        <Plant cx={1250} h={420} p={p} seed={seed + 3} pot={p.stone} />
      </Depth>
      <Depth t={1.18}>
        <line x1={520} y1={F0} x2={520} y2={F0 - 440} stroke={p.dark} strokeWidth={4} />
        <path d={`M520 ${F0 - 440} Q560 ${F0 - 500} 650 ${F0 - 450}`} stroke={p.dark} strokeWidth={4} fill="none" />
        <path d={`M610 ${F0 - 450} C610 ${F0 - 500}, 700 ${F0 - 500}, 700 ${F0 - 450} Z`} fill={p.accent} />
        <ellipse cx={520} cy={F0} rx={34} ry={6} fill={p.dark} />
      </Depth>
      <polygon points={`${P(380, F0, 1.25)} ${P(1220, F0, 1.25)} ${P(1290, F0, 1.75)} ${P(310, F0, 1.75)}`} fill={mix(p.floor, p.fabric, 0.6)} />
      <Shadow cx={VX + 80} cy={VY + (F0 - VY) * 1.32} rx={460} ry={26} id={id} />
      <Depth t={1.32}>
        <Sofa cx={880} w={640} p={p} />
      </Depth>
      <Shadow cx={VX - 10} cy={VY + (F0 - VY) * 1.62} rx={230} ry={24} id={id} />
      <Depth t={1.6}>
        <rect x={680} y={F0 - 80} width={220} height={80} fill={darken(p.stone, 0.12)} />
        <ellipse cx={790} cy={F0 - 80} rx={130} ry={14} fill={lighten(p.stone, 0.1)} />
        <ellipse cx={790} cy={F0} rx={110} ry={10} fill={darken(p.stone, 0.18)} />
        <rect x={680} y={F0 - 80} width={220} height={80} fill={darken(p.stone, 0.12)} />
        <ellipse cx={790} cy={F0 - 80} rx={110} ry={12} fill={lighten(p.stone, 0.12)} />
        <rect x={740} y={F0 - 102} width={70} height={18} fill={p.accent} />
        <rect x={746} y={F0 - 116} width={58} height={14} fill={lighten(p.wall, 0.2)} />
        <ellipse cx={850} cy={F0 - 92} rx={26} ry={10} fill={p.dark} />
      </Depth>
      <Shadow cx={250} cy={1090} rx={220} ry={30} id={id} />
      <Depth t={1.85}>
        <LoungeChair cx={470} p={p} />
      </Depth>
    </g>
  )
}

function Bedroom({ p, id, seed, opening }: LayoutProps) {
  const head = mix(p.wood, p.fabric, 0.15)
  return (
    <g>
      <Opening kind={opening ?? 'window'} x={300} y={230} w={220} h={460} p={p} id={id} />
      <rect x={580} y={420} width={700} height={F0 - 420} fill={head} />
      {Array.from({ length: 22 }, (_, i) => (
        <line key={i} x1={580 + 16 + i * 31.5} y1={420} x2={580 + 16 + i * 31.5} y2={F0} stroke={darken(head, 0.12)} strokeWidth={2} />
      ))}
      <Art x={835} y={250} w={190} h={130} p={p} seed={seed + 1} />
      <Pendant cx={540} y={480} p={p} kind="globe" size={0.8} />
      <Pendant cx={1320} y={480} p={p} kind="globe" size={0.8} />
      <Box x0={470} x1={590} top={F0 - 150} t0={1.0} t1={1.12} front={p.wood} />
      <Box x0={1270} x1={1390} top={F0 - 150} t0={1.0} t1={1.12} front={p.wood} />
      <Depth t={1.0}>
        <Vase cx={1325} base={F0 - 150} p={p} tall={0.5} color={p.accent} />
      </Depth>
      <Shadow cx={VX + 130} cy={VY + (F0 - VY) * 1.5} rx={560} ry={34} id={id} />
      <Box x0={640} x1={1240} top={F0 - 70} t0={1.02} t1={1.48} front={darken(p.wood, 0.1)} />
      <Box x0={650} x1={1230} top={F0 - 145} bottom={F0 - 70} t0={1.02} t1={1.46} front={darken(p.fabric, 0.06)} topFill={lighten(p.fabric, 0.12)} />
      <polygon points={`${P(650, F0 - 145, 1.28)} ${P(1230, F0 - 145, 1.28)} ${P(1230, F0 - 145, 1.46)} ${P(650, F0 - 145, 1.46)}`} fill={p.accent} />
      <polygon points={`${P(650, F0 - 145, 1.46)} ${P(1230, F0 - 145, 1.46)} ${P(1230, F0 - 100, 1.46)} ${P(650, F0 - 100, 1.46)}`} fill={darken(p.accent, 0.12)} />
      <Depth t={1.05}>
        <rect x={680} y={F0 - 230} width={250} height={90} rx={26} fill={lighten(p.fabric, 0.22)} />
        <rect x={950} y={F0 - 230} width={250} height={90} rx={26} fill={lighten(p.fabric, 0.22)} />
        <rect x={760} y={F0 - 200} width={160} height={66} rx={16} fill={mix(p.fabric, p.accent, 0.35)} />
      </Depth>
    </g>
  )
}

function Kitchen({ p, id, seed, opening }: LayoutProps) {
  const cab = mix(p.wood, p.wall, 0.15)
  const r = seeded(seed)
  return (
    <g>
      <rect x={W0} y={C0} width={250} height={F0 - C0} fill={cab} />
      {[0, 1].map((i) => (
        <rect key={i} x={W0 + 14 + i * 118} y={C0 + 16} width={104} height={F0 - C0 - 40} fill="none" stroke={darken(cab, 0.12)} strokeWidth={2} />
      ))}
      <rect x={W0 + 250} y={400} width={W1 - W0 - 250} height={250} fill={p.stone} />
      {Array.from({ length: 6 }, (_, i) => {
        const x = W0 + 270 + r() * 760
        return <path key={i} d={`M${x} 400 C${x + 40} 470, ${x - 20} 540, ${x + 50} 650`} stroke={darken(p.stone, 0.15)} strokeWidth={1.5} fill="none" />
      })}
      <Opening kind={opening ?? 'grid'} x={720} y={170} w={380} h={220} p={p} id={id} />
      <rect x={W0 + 250} y={636} width={W1 - W0 - 250} height={16} fill={lighten(p.stone, 0.15)} />
      <rect x={W0 + 250} y={652} width={W1 - W0 - 250} height={F0 - 652} fill={cab} />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={W0 + 250 + ((i + 1) * (W1 - W0 - 250)) / 7} y1={652} x2={W0 + 250 + ((i + 1) * (W1 - W0 - 250)) / 7} y2={F0 - 10} stroke={darken(cab, 0.15)} strokeWidth={2} />
      ))}
      <Depth t={1}>
        <Vase cx={620} base={636} p={p} tall={0.55} />
        <rect x={1180} y={590} width={60} height={46} fill={p.wood} />
      </Depth>
      <Pendant cx={560} y={430} p={p} kind="cone" size={0.9} />
      <Pendant cx={800} y={430} p={p} kind="cone" size={0.9} />
      <Pendant cx={1040} y={430} p={p} kind="cone" size={0.9} />
      <Shadow cx={VX} cy={VY + (F0 - VY) * 1.62} rx={480} ry={28} id={id} />
      <Box x0={470} x1={1130} top={F0 - 200} bottom={F0 - 10} t0={1.3} t1={1.58} front={p.wood} />
      <Box x0={455} x1={1145} top={F0 - 216} bottom={F0 - 200} t0={1.28} t1={1.6} front={lighten(p.stone, 0.05)} topFill={lighten(p.stone, 0.22)} />
      {Array.from({ length: 26 }, (_, i) => {
        const x = 480 + i * 25
        return <line key={i} x1={VX + (x - VX) * 1.58} y1={VY + (F0 - 195 - VY) * 1.58} x2={VX + (x - VX) * 1.58} y2={VY + (F0 - 12 - VY) * 1.58} stroke={darken(p.wood, 0.12)} strokeWidth={2} />
      })}
      <Depth t={1.62}>
        <rect x={470} y={F0 - 10} width={660} height={10} fill={p.dark} />
      </Depth>
      {[560, 800, 1040].map((cx) => (
        <Depth key={cx} t={1.78}>
          <g>
            <line x1={cx - 36} y1={F0} x2={cx - 24} y2={F0 - 150} stroke={p.dark} strokeWidth={4} />
            <line x1={cx + 36} y1={F0} x2={cx + 24} y2={F0 - 150} stroke={p.dark} strokeWidth={4} />
            <line x1={cx - 32} y1={F0 - 50} x2={cx + 32} y2={F0 - 50} stroke={p.dark} strokeWidth={3} />
            <ellipse cx={cx} cy={F0 - 152} rx={44} ry={12} fill={p.fabric} />
            <rect x={cx - 44} y={F0 - 152} width={88} height={14} fill={darken(p.fabric, 0.1)} />
          </g>
        </Depth>
      ))}
    </g>
  )
}

function Dining({ p, id, seed, opening }: LayoutProps) {
  return (
    <g>
      <Opening kind={opening ?? 'arch'} x={640} y={220} w={320} h={F0 - 220} p={p} id={id} />
      <Art x={330} y={300} w={200} h={260} p={p} seed={seed + 2} />
      <Box x0={1050} x1={1320} top={F0 - 170} t0={1.0} t1={1.1} front={p.wood} />
      <Depth t={1.0}>
        <Vase cx={1130} base={F0 - 170} p={p} tall={0.9} />
        <circle cx={1240} cy={F0 - 196} r={26} fill={p.accent} />
      </Depth>
      <Depth t={1.26}>
        <Chair cx={620} p={p} />
        <Chair cx={800} p={p} />
        <Chair cx={980} p={p} />
      </Depth>
      <Shadow cx={VX} cy={VY + (F0 - VY) * 1.48} rx={420} ry={34} id={id} />
      <Depth t={1.42}>
        <rect x={780} y={F0 - 150} width={40} height={150} fill={darken(p.wood, 0.15)} />
        <ellipse cx={800} cy={F0} rx={130} ry={14} fill={darken(p.wood, 0.25)} />
        <rect x={430} y={F0 - 170} width={740} height={22} fill={darken(p.wood, 0.08)} />
        <ellipse cx={800} cy={F0 - 170} rx={370} ry={24} fill={lighten(p.wood, 0.12)} />
        <Vase cx={800} base={F0 - 172} p={p} tall={0.45} color={lighten(p.stone, 0.1)} />
      </Depth>
      <Depth t={1.72}>
        <Chair cx={560} p={p} back scale={1} />
        <Chair cx={1040} p={p} back scale={1} />
      </Depth>
      <line x1={560} y1={0} x2={560} y2={300} stroke={p.dark} strokeWidth={2} />
      <line x1={1040} y1={0} x2={1040} y2={300} stroke={p.dark} strokeWidth={2} />
      <rect x={540} y={300} width={520} height={18} rx={9} fill={p.accent} />
      <rect x={560} y={318} width={480} height={4} fill="#fff6e0" />
    </g>
  )
}

function Lobby({ p, id, seed, opening }: LayoutProps) {
  return (
    <g>
      <Opening kind={opening ?? 'arch'} x={620} y={160} w={360} h={F0 - 160} p={p} id={id} />
      <Art x={320} y={330} w={170} h={230} p={p} seed={seed} />
      <Art x={1110} y={330} w={170} h={230} p={p} seed={seed + 5} />
      <ellipse cx={800} cy={250} rx={260} ry={34} fill="none" stroke={p.accent} strokeWidth={8} />
      {[-200, 0, 200].map((dx) => (
        <line key={dx} x1={800 + dx} y1={0} x2={800 + dx} y2={222} stroke={p.dark} strokeWidth={1.5} />
      ))}
      <Depth t={1.1}>
        <Plant cx={420} h={360} p={p} seed={seed + 9} pot={darken(p.stone, 0.1)} />
        <Plant cx={1180} h={360} p={p} seed={seed + 11} pot={darken(p.stone, 0.1)} />
      </Depth>
      <Shadow cx={VX} cy={VY + (F0 - VY) * 1.45} rx={420} ry={30} id={id} />
      <Depth t={1.42}>
        <path d={`M500 ${F0} L500 ${F0 - 170} Q500 ${F0 - 190} 520 ${F0 - 190} L1080 ${F0 - 190} Q1100 ${F0 - 190} 1100 ${F0 - 170} L1100 ${F0} Z`} fill={p.stone} />
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1={512 + i * 20} y1={F0 - 180} x2={512 + i * 20} y2={F0 - 6} stroke={darken(p.stone, 0.12)} strokeWidth={2} />
        ))}
        <rect x={490} y={F0 - 204} width={620} height={16} fill={p.accent} />
        <rect x={490} y={F0 - 6} width={620} height={6} fill={p.dark} />
        <Vase cx={1010} base={F0 - 204} p={p} tall={0.5} color={p.dark} />
      </Depth>
      <Shadow cx={150} cy={1100} rx={200} ry={30} id={id} />
      <Shadow cx={1450} cy={1100} rx={200} ry={30} id={id} />
      <Depth t={1.9}>
        <LoungeChair cx={450} p={p} />
        <LoungeChair cx={1150} p={p} flip />
      </Depth>
    </g>
  )
}

function Office({ p, id, seed, opening }: LayoutProps) {
  return (
    <g>
      <Opening kind={opening ?? 'grid'} x={330} y={190} w={940} h={420} p={p} id={id} />
      <Depth t={1.02}>
        <Plant cx={1290} h={380} p={p} seed={seed} pot={p.dark} />
      </Depth>
      <Pendant cx={560} y={420} p={p} kind="dome" size={0.8} />
      <Pendant cx={1040} y={420} p={p} kind="dome" size={0.8} />
      <Depth t={1.3}>
        <Chair cx={560} p={p} />
        <Chair cx={800} p={p} />
        <Chair cx={1040} p={p} />
      </Depth>
      <Shadow cx={VX} cy={VY + (F0 - VY) * 1.55} rx={460} ry={30} id={id} />
      <Box x0={420} x1={1180} top={F0 - 180} bottom={F0 - 160} t0={1.25} t1={1.52} front={p.wood} />
      <Depth t={1.52}>
        <rect x={460} y={F0 - 160} width={24} height={160} fill={p.dark} />
        <rect x={1116} y={F0 - 160} width={24} height={160} fill={p.dark} />
        <rect x={600} y={F0 - 196} width={150} height={14} fill={lighten(p.wall, 0.3)} />
        <rect x={880} y={F0 - 196} width={120} height={14} fill={p.accent} />
      </Depth>
      <Depth t={1.85}>
        <Chair cx={600} p={p} back />
        <Chair cx={1000} p={p} back />
      </Depth>
    </g>
  )
}

function Bath({ p, id, seed, opening }: LayoutProps) {
  const r = seeded(seed)
  return (
    <g>
      <rect x={W0} y={C0} width={W1 - W0} height={F0 - C0} fill={p.stone} />
      {Array.from({ length: 12 }, (_, i) => {
        const x = W0 + r() * (W1 - W0)
        return <path key={i} d={`M${x} ${C0} C${x + 60} ${C0 + 200}, ${x - 50} ${C0 + 420}, ${x + 40} ${F0}`} stroke={darken(p.stone, 0.12)} strokeWidth={1.4} fill="none" opacity={0.7} />
      })}
      <Opening kind={opening ?? 'slats'} x={W0 + 40} y={220} w={200} h={500} p={p} id={id} />
      <path d={`M680 560 L680 320 A120 120 0 0 1 920 320 L920 560 Z`} fill={lighten(p.sky, 0.25)} stroke={p.accent} strokeWidth={8} />
      <path d={`M700 540 L700 330 A100 100 0 0 1 760 245`} stroke="#ffffff" strokeWidth={6} opacity={0.4} fill="none" />
      {[620, 980].map((x) => (
        <g key={x}>
          <rect x={x - 4} y={380} width={8} height={60} fill={p.accent} />
          <circle cx={x} cy={370} r={18} fill="#fff6e0" />
        </g>
      ))}
      <Box x0={1080} x1={1300} top={F0 - 260} bottom={F0 - 110} t0={1.0} t1={1.1} front={p.wood} />
      <Shadow cx={VX} cy={VY + (F0 - VY) * 1.5} rx={420} ry={30} id={id} />
      <Depth t={1.45}>
        <path d={`M500 ${F0 - 210} L1100 ${F0 - 210} C1100 ${F0 - 60}, 1040 ${F0 - 10}, 960 ${F0 - 10} L640 ${F0 - 10} C560 ${F0 - 10}, 500 ${F0 - 60}, 500 ${F0 - 210} Z`} fill={lighten(p.stone, 0.25)} />
        <ellipse cx={800} cy={F0 - 210} rx={300} ry={22} fill={lighten(p.stone, 0.35)} />
        <ellipse cx={800} cy={F0 - 206} rx={270} ry={14} fill={lighten(p.sky, 0.3)} />
        <rect x={1050} y={F0 - 330} width={8} height={120} fill={p.accent} />
        <rect x={1020} y={F0 - 334} width={38} height={8} fill={p.accent} />
      </Depth>
      <Depth t={1.8}>
        <rect x={1180} y={F0 - 160} width={120} height={160} fill={p.wood} />
        <rect x={1176} y={F0 - 168} width={128} height={10} fill={lighten(p.wood, 0.1)} />
        <rect x={1200} y={F0 - 220} width={80} height={52} fill={lighten(p.fabric, 0.2)} />
      </Depth>
    </g>
  )
}

/** Close, frontal still life — console, mirror, objects. */
function Vignette({ p, seed }: LayoutProps) {
  return (
    <g>
      <rect x={-400} y={-400} width={2400} height={2000} fill={p.wall} />
      <rect x={-400} y={940} width={2400} height={700} fill={p.floor} />
      <circle cx={800} cy={420} r={250} fill={darken(p.wall, 0.08)} />
      <circle cx={800} cy={420} r={236} fill={`url(#${'v'}${seed}-mirror)`} />
      <circle cx={800} cy={420} r={236} fill={lighten(p.sky, 0.25)} opacity={0.6} />
      <path d={`M640 260 A220 220 0 0 1 760 200`} stroke="#fff" strokeWidth={8} opacity={0.45} fill="none" />
      <rect x={380} y={700} width={840} height={40} fill={p.wood} />
      <rect x={400} y={740} width={800} height={180} fill={darken(p.wood, 0.1)} />
      {Array.from({ length: 31 }, (_, i) => (
        <line key={i} x1={410 + i * 26} y1={746} x2={410 + i * 26} y2={914} stroke={darken(p.wood, 0.2)} strokeWidth={2} />
      ))}
      <rect x={420} y={920} width={20} height={30} fill={p.dark} />
      <rect x={1160} y={920} width={20} height={30} fill={p.dark} />
      <g transform="translate(0 -100)">
        <Vase cx={520} base={800} p={p} tall={1.6} color={p.stone} />
      </g>
      <rect x={880} y={650} width={180} height={22} fill={p.accent} />
      <rect x={892} y={628} width={156} height={22} fill={lighten(p.wall, 0.3)} />
      <circle cx={1110} cy={668} r={32} fill={p.dark} />
      <path d={`M1100 520 L1150 520 L1180 610 L1070 610 Z`} fill={lighten(p.fabric, 0.15)} />
      <rect x={1121} y={610} width={8} height={70} fill={p.accent} />
      <ellipse cx={1125} cy={690} rx={50} ry={10} fill={p.accent} />
    </g>
  )
}

interface LayoutProps {
  p: ScenePalette
  id: string
  seed: number
  opening?: OpeningKind
}

const layouts: Record<RoomKind, (props: LayoutProps) => ReactNode> = {
  living: LivingRoom,
  bedroom: Bedroom,
  kitchen: Kitchen,
  dining: Dining,
  lobby: Lobby,
  office: Office,
  bath: Bath,
  vignette: Vignette,
}

const floorFor: Record<RoomKind, FloorKind> = {
  living: 'oak',
  bedroom: 'oak',
  kitchen: 'stone',
  dining: 'oak',
  lobby: 'terrazzo',
  office: 'concrete',
  bath: 'stone',
  vignette: 'oak',
}

/** The unfinished "before" state: bare plaster, screed floor, a work light. */
function BeforeRoom({ p, id, room }: { p: ScenePalette; id: string; room: RoomKind }) {
  const bare = '#cfc7bb'
  return (
    <g>
      <rect x={W0} y={C0} width={W1 - W0} height={F0 - C0} fill={bare} />
      {[
        [380, 300, 160, 90],
        [930, 520, 220, 120],
        [1150, 230, 120, 160],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={darken(bare, 0.06)} opacity={0.8} />
      ))}
      {room === 'kitchen' || room === 'office' ? (
        <rect x={720} y={200} width={380} height={260} fill={lighten(p.sky, 0.2)} stroke="#8e8579" strokeWidth={10} />
      ) : (
        <rect x={room === 'dining' || room === 'lobby' ? 660 : 340} y={300} width={260} height={F0 - 300} fill={lighten(p.sky, 0.2)} stroke="#8e8579" strokeWidth={10} />
      )}
      <line x1={W0 + 40} y1={640} x2={W1 - 40} y2={640} stroke="#a9a094" strokeWidth={3} strokeDasharray="14 10" />
      <rect x={1180} y={540} width={44} height={60} fill="#efe9df" stroke="#8e8579" />
      <line x1={800} y1={-300} x2={800} y2={300} stroke="#5b534a" strokeWidth={2} />
      <circle cx={800} cy={312} r={14} fill="#fff6e0" />
      <Depth t={1.4}>
        <g stroke="#7b6f62" strokeWidth={8}>
          <line x1={1000} y1={F0} x2={1070} y2={F0 - 400} />
          <line x1={1140} y1={F0} x2={1090} y2={F0 - 400} />
          {[0.2, 0.4, 0.6, 0.8].map((k) => (
            <line key={k} x1={1000 + 70 * k} y1={F0 - 400 * k} x2={1140 - 50 * k} y2={F0 - 400 * k} strokeWidth={6} />
          ))}
        </g>
        <path d={`M560 ${F0} L570 ${F0 - 90} L650 ${F0 - 90} L660 ${F0} Z`} fill="#d9d2c6" />
        <ellipse cx={610} cy={F0 - 90} rx={40} ry={8} fill="#bdb4a7" />
      </Depth>
      <Shadow cx={VX} cy={1000} rx={500} ry={40} id={id} o={0.4} />
    </g>
  )
}

function RoomSceneImpl({ room, palette: p, floor, opening, state = 'after', seed = 7, title, className }: SceneProps) {
  const rid = useId().replace(/:/g, '')
  const id = `rs${rid}`
  const before = state === 'before'
  const f = floor ?? floorFor[room]
  const floorColor = before ? '#b9b1a5' : p.floor
  const wall = before ? '#d8d1c6' : p.wall

  return (
    <svg
      viewBox="0 0 1600 1200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(p.sky, 0.15)} />
          <stop offset="1" stopColor={lighten(p.sky, 0.55)} />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0" stopColor={p.dark} stopOpacity={0.32} />
          <stop offset="1" stopColor={p.dark} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff8ea" stopOpacity={0.22} />
          <stop offset="0.55" stopColor="#fff8ea" stopOpacity={0} />
          <stop offset="1" stopColor="#2a1f18" stopOpacity={0.16} />
        </linearGradient>
        <clipPath id={`${id}-floor`}>
          <polygon points={`${W0},${F0} ${W1},${F0} 1975,1200 -375,1200`} />
        </clipPath>
        <radialGradient id={`v${seed}-mirror`}>
          <stop offset="0" stopColor={lighten(p.wall, 0.4)} />
          <stop offset="1" stopColor={darken(p.wall, 0.05)} />
        </radialGradient>
      </defs>

      {room === 'vignette' && !before ? (
        <Vignette p={p} id={id} seed={seed} />
      ) : (
        <>
          {/* shell */}
          <polygon points={`${W0},${C0} ${W1},${C0} 1975,-280 -375,-280`} fill={lighten(wall, 0.12)} />
          <polygon points={`${W0},${C0} ${W0},${F0} -375,1200 -375,-280`} fill={darken(wall, 0.07)} />
          <polygon points={`${W1},${C0} ${W1},${F0} 1975,1200 1975,-280`} fill={darken(wall, 0.11)} />
          <rect x={W0} y={C0} width={W1 - W0} height={F0 - C0} fill={wall} />
          <polygon points={`${W0},${F0} ${W1},${F0} 1975,1200 -375,1200`} fill={floorColor} />
          {!before && (
            <g clipPath={`url(#${id}-floor)`}>
              <FloorPattern kind={f} p={p} seed={seed} />
            </g>
          )}
          {/* skirting */}
          {!before && (
            <>
              <rect x={W0} y={F0 - 10} width={W1 - W0} height={10} fill={darken(wall, 0.08)} />
              <polygon points={`${W0},${F0 - 10} ${W0},${F0} -375,1200 -375,${1200 - 22}`} fill={darken(wall, 0.14)} />
              <polygon points={`${W1},${F0 - 10} ${W1},${F0} 1975,1200 1975,${1200 - 22}`} fill={darken(wall, 0.18)} />
            </>
          )}
          {before ? <BeforeRoom p={p} id={id} room={room} /> : layouts[room]({ p, id, seed, opening })}
        </>
      )}
      {/* photographic light fall-off */}
      <rect x={0} y={0} width={1600} height={1200} fill={`url(#${id}-light)`} pointerEvents="none" />
    </svg>
  )
}

export const RoomScene = memo(RoomSceneImpl)
