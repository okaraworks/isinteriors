import { firebaseEnabled, getDb, getFirebaseApp, photoUploadMode, trackEvent } from './firebase'
import { compressImage } from './imageCompress'
import { cloudinaryUploadsEnabled, uploadToCloudinary } from './cloudinary'
import { emailNotifyEnabled, notifyStudio } from './emailNotify'

export type InquiryType = 'site-visit' | 'consultation'

export interface InquiryInput {
  type: InquiryType
  name: string
  phone: string
  email: string
  location: string
  propertyType: string
  preferredDate: string
  description: string
  design?: string
  moodboard?: string[]
  estimate?: string
  photos: File[]
}

export interface InquiryResult {
  id: string
  mode: 'firebase' | 'email' | 'demo'
}

/** Strip control characters and trim; Firestore rules enforce lengths again server-side. */
const clean = (s: string | undefined, max: number) =>
  (s ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max)

const RATE_KEY = 'isoe:inquiry-times'
/** Soft client-side throttle (3 per 10 minutes). Real abuse protection is App Check + rules. */
function checkRateLimit() {
  try {
    const now = Date.now()
    const times = (JSON.parse(localStorage.getItem(RATE_KEY) ?? '[]') as number[]).filter((t) => now - t < 10 * 60_000)
    if (times.length >= 3) throw new Error('You have sent several requests in a short time. Please wait a few minutes, or contact the studio directly.')
    localStorage.setItem(RATE_KEY, JSON.stringify([...times, now]))
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('You have')) throw e
  }
}

export function sanitizeInquiry(input: InquiryInput) {
  return {
    type: input.type,
    name: clean(input.name, 120),
    phone: clean(input.phone, 40),
    email: clean(input.email, 160).toLowerCase(),
    location: clean(input.location, 200),
    propertyType: clean(input.propertyType, 60),
    preferredDate: clean(input.preferredDate, 10),
    description: clean(input.description, 4000),
    design: clean(input.design, 80),
    moodboard: (input.moodboard ?? []).slice(0, 12).map((m) => clean(m, 40)),
    estimate: clean(input.estimate, 300),
  }
}

/**
 * Pluggable submit handler:
 *   1. photos → Cloudinary (full size, if configured) or compressed into Firestore
 *   2. inquiry → Firestore (if Firebase is configured)
 *   3. email alert → EmailJS or Formspree (if configured)
 * With none configured, a demo handler simulates success so the UI can be reviewed.
 */
export async function submitInquiry(input: InquiryInput, onProgress?: (msg: string) => void): Promise<InquiryResult> {
  checkRateLimit()
  const data = sanitizeInquiry(input)
  const ref = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

  if (!firebaseEnabled && !emailNotifyEnabled()) {
    await new Promise((r) => setTimeout(r, 900))
    if (import.meta.env.DEV) console.info('[demo] inquiry not sent — no backend configured', data, input.photos.map((f) => f.name))
    return { id: `demo-${ref}`, mode: 'demo' }
  }

  // 1. Full-size photos to Cloudinary first, so their links can be saved and emailed.
  const useCloudinary = cloudinaryUploadsEnabled() && input.photos.length > 0
  const photoUrls: string[] = []
  if (useCloudinary) {
    for (let i = 0; i < input.photos.length; i++) {
      onProgress?.(`Uploading photo ${i + 1} of ${input.photos.length}…`)
      // Re-encode at high quality first: keeps full size but strips EXIF/GPS metadata.
      const { dataUrl } = await compressImage(input.photos[i], 3200, 14_000_000)
      photoUrls.push(await uploadToCloudinary(dataUrl, ref))
    }
  }

  // 2. Firestore record.
  let id = ref
  if (firebaseEnabled) {
    const db = await getDb()
    const { collection, doc, serverTimestamp, setDoc } = await import('firebase/firestore')
    const docRef = doc(collection(db, 'inquiries'))
    id = docRef.id
    onProgress?.('Sending your details…')
    await setDoc(docRef, {
      ...data,
      photoCount: input.photos.length,
      photoStorage: useCloudinary ? 'cloudinary' : photoUploadMode,
      ...(useCloudinary ? { photoUrls } : {}),
      status: 'new',
      createdAt: serverTimestamp(),
    })

    if (!useCloudinary) {
      for (let i = 0; i < input.photos.length; i++) {
        onProgress?.(`Uploading photo ${i + 1} of ${input.photos.length}…`)
        const file = input.photos[i]
        if (photoUploadMode === 'storage') {
          // Requires the Blaze plan: Cloud Storage buckets are not available on Spark.
          const app = await getFirebaseApp()
          const { getStorage, ref: sref, uploadBytes } = await import('firebase/storage')
          const safeName = file.name.replace(/[^\w.-]+/g, '_').slice(-80)
          await uploadBytes(sref(getStorage(app), `inquiries/${id}/${i}-${safeName}`), file, { contentType: file.type })
        } else {
          const { dataUrl, width, height } = await compressImage(file)
          await setDoc(doc(db, 'inquiries', id, 'photos', String(i)), {
            index: i,
            name: clean(file.name, 120),
            contentType: 'image/jpeg',
            width,
            height,
            data: dataUrl,
            createdAt: serverTimestamp(),
          })
        }
      }
    }
  }

  // 3. Email alert to the studio.
  if (emailNotifyEnabled()) {
    try {
      await notifyStudio({
        subject: `New ${data.type === 'site-visit' ? 'site visit' : 'consultation'} request from ${data.name}`,
        inquiry_type: data.type === 'site-visit' ? 'Site visit' : 'Consultation',
        name: data.name,
        phone: data.phone,
        email: data.email,
        location: data.location,
        property_type: data.propertyType,
        preferred_date: data.preferredDate,
        description: data.description,
        design: data.design || '—',
        moodboard: data.moodboard.join(', ') || '—',
        estimate: data.estimate || '—',
        photos: photoUrls.length ? photoUrls.join('\n') : input.photos.length ? `${input.photos.length} photo(s) — see the studio inbox` : 'None',
        reference: id,
      })
    } catch (e) {
      // If the inquiry is already safely in Firestore, a failed email must not fail the request.
      if (!firebaseEnabled) throw e
      if (import.meta.env.DEV) console.warn('[email] notification failed', e)
    }
  }

  void trackEvent('generate_lead', { inquiry_type: data.type })
  return { id, mode: firebaseEnabled ? 'firebase' : 'email' }
}
