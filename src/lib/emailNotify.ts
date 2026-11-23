import { integrations } from '../config/integrations'

export type NotifyPayload = Record<string, string>

/**
 * Emails the studio about a new inquiry through EmailJS or Formspree (both
 * have free tiers and need no server). Returns which service was used, or null.
 */
export async function notifyStudio(p: NotifyPayload): Promise<'emailjs' | 'formspree' | null> {
  const { emailjs, formspreeId } = integrations
  if (emailjs) {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: emailjs.serviceId, template_id: emailjs.templateId, user_id: emailjs.publicKey, template_params: p }),
    })
    if (!res.ok) throw new Error(`EmailJS ${res.status}`)
    return 'emailjs'
  }
  if (formspreeId) {
    const res = await fetch(`https://formspree.io/f/${encodeURIComponent(formspreeId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...p, _subject: p.subject, _replyto: p.email }),
    })
    if (!res.ok) throw new Error(`Formspree ${res.status}`)
    return 'formspree'
  }
  return null
}

export const emailNotifyEnabled = () => Boolean(integrations.emailjs || integrations.formspreeId)
