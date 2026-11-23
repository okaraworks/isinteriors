import { firebaseEnabled, getDb, getFirebaseApp, photoUploadMode, trackEvent } from './firebase'
import { compressImage } from './imageCompress'

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
  mode: 'firebase' | 'demo'
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
 * Pluggable submit handler. With Firebase configured the inquiry is written to
 * Firestore; otherwise a demo handler simulates success so the UI can be
 * reviewed without a backend.
 */
export async function submitInquiry(input: InquiryInput, onProgress?: (msg: string) => void): Promise<InquiryResult> {
  checkRateLimit()
  const data = sanitizeInquiry(input)

  if (!firebaseEnabled) {
    await new Promise((r) => setTimeout(r, 900))
    if (import.meta.env.DEV) console.info('[demo] inquiry not sent — Firebase is not configured', data, input.photos.map((f) => f.name))
    return { id: `demo-${Date.now().toString(36)}`, mode: 'demo' }
  }

  const db = await getDb()
  const { collection, doc, serverTimestamp, setDoc } = await import('firebase/firestore')
  const ref = doc(collection(db, 'inquiries'))
  onProgress?.('Sending your details…')
  await setDoc(ref, {
    ...data,
    photoCount: input.photos.length,
    photoStorage: photoUploadMode,
    status: 'new',
    createdAt: serverTimestamp(),
  })

  for (let i = 0; i < input.photos.length; i++) {
    onProgress?.(`Uploading photo ${i + 1} of ${input.photos.length}…`)
    const file = input.photos[i]
    if (photoUploadMode === 'storage') {
      // Requires the Blaze plan: Cloud Storage buckets are not available on Spark.
      const app = await getFirebaseApp()
      const { getStorage, ref: sref, uploadBytes } = await import('firebase/storage')
      const safeName = file.name.replace(/[^\w.-]+/g, '_').slice(-80)
      await uploadBytes(sref(getStorage(app), `inquiries/${ref.id}/${i}-${safeName}`), file, { contentType: file.type })
    } else {
      const { dataUrl, width, height } = await compressImage(file)
      await setDoc(doc(db, 'inquiries', ref.id, 'photos', String(i)), {
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

  void trackEvent('generate_lead', { inquiry_type: data.type })
  return { id: ref.id, mode: 'firebase' }
}
