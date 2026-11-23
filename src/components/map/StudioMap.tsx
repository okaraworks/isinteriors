import { useEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { BRAND_GOLD, BRAND_NAVY } from '../brand/Logo'

const loc = site.location

/** Link that opens the studio in OpenStreetMap (works without loading any map tiles). */
export const osmLink = loc ? `https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}#map=17/${loc.lat}/${loc.lng}` : null
export const osmDirections = loc ? `https://www.openstreetmap.org/directions?to=${loc.lat}%2C${loc.lng}` : null

/**
 * Studio location on OpenStreetMap (free, no API key), drawn with Leaflet.
 * Tiles load only after the visitor presses "Show map", so no third-party
 * request is made on page load. Until the studio's coordinates are set
 * (VITE_STUDIO_LAT / VITE_STUDIO_LNG) a clearly marked placeholder is shown.
 */
export function StudioMap({ className = '' }: { className?: string }) {
  const [show, setShow] = useState(false)
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!show || !loc || !el.current) return
    let map: import('leaflet').Map | undefined
    let cancelled = false
    void Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]).then(([L]) => {
      if (cancelled || !el.current) return
      map = L.map(el.current, { center: [loc.lat, loc.lng], zoom: 16, scrollWheelZoom: false, attributionControl: true })
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map)
      const icon = L.divIcon({
        className: '',
        iconSize: [36, 46],
        iconAnchor: [18, 46],
        html: `<svg width="36" height="46" viewBox="0 0 36 46" aria-hidden="true"><path d="M18 45C18 45 3 28 3 17a15 15 0 0 1 30 0c0 11-15 28-15 28Z" fill="${BRAND_NAVY}" stroke="#F8F6F1" stroke-width="2"/><circle cx="18" cy="17" r="5" fill="${BRAND_GOLD}"/></svg>`,
      })
      L.marker([loc.lat, loc.lng], { icon, title: site.name, alt: `${site.name} studio` }).addTo(map)
    })
    return () => {
      cancelled = true
      map?.remove()
    }
  }, [show])

  if (!loc) {
    return (
      <div className={`flex aspect-[4/3] items-center justify-center border border-dashed border-taupe bg-beige/40 p-6 text-center ${className}`}>
        <p className="placeholder-text max-w-xs text-sm text-ink-soft">Studio map — add the studio's location to show it here.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] overflow-hidden border border-line bg-beige/50">
        {show ? (
          <div ref={el} className="osm-warm absolute inset-0" role="region" aria-label={`Map showing ${site.name}`} />
        ) : (
          <button type="button" onClick={() => setShow(true)} className="group absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <svg width="30" height="38" viewBox="0 0 36 46" aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-1">
              <path d="M18 45C18 45 3 28 3 17a15 15 0 0 1 30 0c0 11-15 28-15 28Z" fill={BRAND_NAVY} />
              <circle cx="18" cy="17" r="5" fill={BRAND_GOLD} />
            </svg>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-espresso">Show map</span>
            <span className="max-w-[16rem] text-xs text-ink-soft">Loads OpenStreetMap</span>
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs uppercase tracking-[0.18em]">
        <a href={osmLink!} target="_blank" rel="noopener noreferrer" className="link-underline">Open in maps ↗</a>
        <a href={osmDirections!} target="_blank" rel="noopener noreferrer" className="link-underline">Directions ↗</a>
      </div>
    </div>
  )
}
