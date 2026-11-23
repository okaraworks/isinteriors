/**
 * Free third-party integrations. Every value comes from an environment
 * variable (see .env.example); a feature switches itself on when its value is set.
 */
const env = import.meta.env
const v = (x: string | undefined) => (x && x.trim()) || null

export const integrations = {
  /** Cal.com event link, e.g. "isoe-interiors/consultation" (cal.com/<this>). Preferred if both are set. */
  calLink: v(env.VITE_CAL_LINK),
  /** Calendly event URL, e.g. "https://calendly.com/isoe-interiors/consultation". */
  calendlyUrl: v(env.VITE_CALENDLY_URL),

  /** EmailJS (200 emails/month free): public key, service ID and template ID. */
  emailjs: v(env.VITE_EMAILJS_PUBLIC_KEY) && v(env.VITE_EMAILJS_SERVICE_ID) && v(env.VITE_EMAILJS_TEMPLATE_ID)
    ? { publicKey: env.VITE_EMAILJS_PUBLIC_KEY!, serviceId: env.VITE_EMAILJS_SERVICE_ID!, templateId: env.VITE_EMAILJS_TEMPLATE_ID! }
    : null,
  /** Formspree form ID (50 submissions/month free), e.g. "xyzabcd" from formspree.io/f/xyzabcd. */
  formspreeId: v(env.VITE_FORMSPREE_FORM_ID),

  /** Cloudinary (25 credits/month free): cloud name + an UNSIGNED upload preset. */
  cloudinary: v(env.VITE_CLOUDINARY_CLOUD_NAME)
    ? { cloudName: env.VITE_CLOUDINARY_CLOUD_NAME!, uploadPreset: v(env.VITE_CLOUDINARY_UPLOAD_PRESET) }
    : null,

  /** Microsoft Clarity project ID — loads only after analytics consent. */
  clarityId: v(env.VITE_CLARITY_PROJECT_ID),
}
