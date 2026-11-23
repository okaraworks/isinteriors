import { memo, useId } from 'react'
import { darken, lighten, seeded } from '../../lib/color'

export type MaterialTexture = 'stone' | 'marble' | 'wood' | 'weave' | 'boucle' | 'metal' | 'plaster' | 'terrazzo' | 'cane' | 'leather'

interface Props {
  texture: MaterialTexture
  color: string
  seed?: number
  className?: string
  title?: string
}

/** Procedural close-up of a finish, used for material palettes and the moodboard. */
function MaterialSwatchImpl({ texture, color, seed = 3, className, title }: Props) {
  const uid = useId().replace(/:/g, '')
  const r = seeded(seed)
  const dk = darken(color, 0.14)
  const lt = lighten(color, 0.18)

  let body: React.ReactNode = null
  switch (texture) {
    case 'stone':
      body = (
        <>
          {Array.from({ length: 140 }, (_, i) => (
            <ellipse key={i} cx={r() * 400} cy={r() * 400} rx={2 + r() * 9} ry={1 + r() * 3} fill={r() > 0.5 ? dk : lt} opacity={0.35} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`b${i}`} x1={0} y1={40 + i * 55 + r() * 20} x2={400} y2={40 + i * 55 + r() * 20} stroke={dk} strokeWidth={0.8 + r() * 1.4} opacity={0.35} />
          ))}
        </>
      )
      break
    case 'marble':
      body = Array.from({ length: 9 }, (_, i) => {
        const x = r() * 400
        return (
          <path
            key={i}
            d={`M${x} -10 C${x + 80 * (r() - 0.3)} 120, ${x - 90 * r()} 260, ${x + 60 * (r() - 0.5)} 410`}
            stroke={i % 3 ? dk : darken(color, 0.3)}
            strokeWidth={i % 3 ? 1 : 2.4}
            fill="none"
            opacity={0.6}
          />
        )
      })
      break
    case 'wood':
      body = Array.from({ length: 34 }, (_, i) => {
        const y = i * 12 + r() * 6
        return (
          <path
            key={i}
            d={`M-10 ${y} C100 ${y + (r() - 0.5) * 16}, 260 ${y + (r() - 0.5) * 18}, 410 ${y + (r() - 0.5) * 10}`}
            stroke={i % 4 === 0 ? darken(color, 0.22) : dk}
            strokeWidth={i % 4 === 0 ? 2 : 0.8}
            fill="none"
            opacity={0.55}
          />
        )
      })
      break
    case 'weave':
      body = (
        <>
          {Array.from({ length: 100 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 4} x2={400} y2={i * 4} stroke={dk} strokeWidth={0.7} opacity={0.35 + (i % 3) * 0.1} />
          ))}
          {Array.from({ length: 100 }, (_, i) => (
            <line key={`v${i}`} x1={i * 4} y1={0} x2={i * 4} y2={400} stroke={lt} strokeWidth={0.7} opacity={0.4} />
          ))}
        </>
      )
      break
    case 'boucle':
      body = Array.from({ length: 520 }, (_, i) => (
        <circle key={i} cx={r() * 400} cy={r() * 400} r={3 + r() * 5} fill="none" stroke={r() > 0.5 ? dk : lt} strokeWidth={1.4} opacity={0.5} />
      ))
      break
    case 'metal':
      body = (
        <>
          <rect width={400} height={400} fill={`url(#${uid}-sheen)`} />
          {Array.from({ length: 160 }, (_, i) => (
            <line key={i} x1={0} y1={i * 2.5} x2={400} y2={i * 2.5 + r() * 3} stroke={i % 2 ? lt : dk} strokeWidth={0.5} opacity={0.35} />
          ))}
        </>
      )
      break
    case 'plaster':
      body = Array.from({ length: 26 }, (_, i) => (
        <ellipse key={i} cx={r() * 400} cy={r() * 400} rx={40 + r() * 90} ry={20 + r() * 50} fill={r() > 0.5 ? lt : dk} opacity={0.14} transform={`rotate(${r() * 180} 200 200)`} />
      ))
      break
    case 'terrazzo':
      body = Array.from({ length: 180 }, (_, i) => (
        <polygon
          key={i}
          points={(() => {
            const cx = r() * 400
            const cy = r() * 400
            const s = 3 + r() * 10
            return [0, 1, 2, 3].map((k) => `${cx + Math.cos(k * 1.7 + r()) * s},${cy + Math.sin(k * 1.7 + r()) * s}`).join(' ')
          })()}
          fill={[dk, darken(color, 0.35), lt, '#a78b70'][Math.floor(r() * 4)]}
          opacity={0.75}
        />
      ))
      break
    case 'cane':
      body = (
        <g stroke={dk} strokeWidth={3} fill="none" opacity={0.8}>
          {Array.from({ length: 22 }, (_, i) => (
            <line key={`a${i}`} x1={i * 20 - 200} y1={0} x2={i * 20 + 200} y2={400} />
          ))}
          {Array.from({ length: 22 }, (_, i) => (
            <line key={`b${i}`} x1={i * 20 + 200} y1={0} x2={i * 20 - 200} y2={400} />
          ))}
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`c${i}`} x1={i * 20} y1={0} x2={i * 20} y2={400} stroke={lt} />
          ))}
        </g>
      )
      break
    case 'leather':
      body = Array.from({ length: 300 }, (_, i) => (
        <circle key={i} cx={r() * 400} cy={r() * 400} r={0.8 + r() * 1.8} fill={dk} opacity={0.4} />
      ))
      break
  }

  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={lighten(color, 0.35)} />
          <stop offset="0.45" stopColor={color} />
          <stop offset="0.7" stopColor={darken(color, 0.2)} />
          <stop offset="1" stopColor={lighten(color, 0.15)} />
        </linearGradient>
        <linearGradient id={`${uid}-light`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.18} />
          <stop offset="1" stopColor="#000" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <rect width={400} height={400} fill={color} />
      {body}
      <rect width={400} height={400} fill={`url(#${uid}-light)`} />
    </svg>
  )
}

export const MaterialSwatch = memo(MaterialSwatchImpl)
