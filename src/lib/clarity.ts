import { integrations } from '../config/integrations'

let loaded = false
/** Loads Microsoft Clarity (free heatmaps + session recordings). Call only after consent. */
export function startClarity() {
  const id = integrations.clarityId
  if (loaded || !id || !/^[a-z0-9]+$/i.test(id)) return
  loaded = true
  type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] }
  const w = window as unknown as { clarity?: ClarityFn }
  w.clarity =
    w.clarity ??
    Object.assign((...args: unknown[]) => {
      ;(w.clarity!.q = w.clarity!.q ?? []).push(args)
    }, {})
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.clarity.ms/tag/${id}`
  document.head.appendChild(s)
  w.clarity('consent')
}
