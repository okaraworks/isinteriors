/** Small colour helpers used by the illustrated placeholder scenes. */
function parse(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)) as [number, number, number]
}

function toHex([r, g, b]: [number, number, number]) {
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
}

/** Linear mix between two hex colours. t = 0 → a, t = 1 → b */
export function mix(a: string, b: string, t: number) {
  const ca = parse(a)
  const cb = parse(b)
  return toHex([0, 1, 2].map((i) => ca[i] + (cb[i] - ca[i]) * t) as [number, number, number])
}

export const darken = (c: string, t: number) => mix(c, '#000000', t)
export const lighten = (c: string, t: number) => mix(c, '#ffffff', t)

/** Relative luminance, used to pick legible text on swatches. */
export function isDark(hex: string) {
  const [r, g, b] = parse(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.36
}

/** Deterministic PRNG so illustrated scenes render identically on every visit. */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
