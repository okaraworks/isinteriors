import { useState } from 'react'
import { integrations } from '../../config/integrations'

/**
 * Lets clients pick a consultation slot directly, via Cal.com or Calendly
 * (both free). The iframe loads only when the visitor asks for it, so the
 * third-party page (and its cookies) never loads unless wanted.
 */
export function SchedulingEmbed() {
  const [open, setOpen] = useState(false)
  const { calLink, calendlyUrl } = integrations
  const src = calLink
    ? `https://cal.com/${calLink.replace(/^\/+/, '')}?embed=true&theme=light&layout=month_view`
    : calendlyUrl
      ? `${calendlyUrl}${calendlyUrl.includes('?') ? '&' : '?'}hide_gdpr_banner=1&background_color=f8f6f1&text_color=45382f&primary_color=45382f`
      : null
  const provider = calLink ? 'Cal.com' : 'Calendly'

  return (
    <section aria-labelledby="schedule-title" className="border border-line bg-white p-6 sm:p-8">
      <p className="eyebrow">Prefer to choose a time?</p>
      <h2 id="schedule-title" className="mt-3 font-display text-3xl leading-tight">
        Book a consultation slot directly
      </h2>
      {!src ? (
        <p className="mt-5 inline-block border border-dashed border-taupe px-4 py-2 text-xs text-taupe">
          Online booking calendar — add the studio&rsquo;s Cal.com or Calendly link to switch this on.
        </p>
      ) : open ? (
        <iframe title={`Book a consultation (${provider})`} src={src} loading="lazy" className="mt-6 h-[720px] w-full border-0" referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button type="button" onClick={() => setOpen(true)} className="border border-espresso px-6 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] hover:bg-espresso hover:text-ivory">
            Show available times
          </button>
          <p className="text-xs text-ink-soft">Opens the studio&rsquo;s {provider} calendar.</p>
        </div>
      )}
    </section>
  )
}
