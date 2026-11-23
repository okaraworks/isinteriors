/**
 * Firebase, loaded lazily so it never weighs down the first page load.
 *
 * Uses only Spark (free) plan products by default:
 *   • Hosting          — static site + SPA rewrites (firebase.json)
 *   • Cloud Firestore  — inquiries and (compressed) photos, locked down by firestore.rules
 *   • Authentication   — email/password sign-in for the studio inquiry inbox
 *   • App Check        — reCAPTCHA v3 attestation, so only this site can write
 *   • Analytics        — loaded only after the visitor accepts analytics cookies
 *
 * If the VITE_FIREBASE_* variables are not set the site still works: forms use
 * a local demo handler and nothing leaves the browser.
 */
import type { FirebaseApp } from 'firebase/app'

const env = import.meta.env

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)
export const photoUploadMode: 'firestore' | 'storage' = env.VITE_PHOTO_UPLOAD_MODE === 'storage' ? 'storage' : 'firestore'

let appPromise: Promise<FirebaseApp> | null = null

export function getFirebaseApp(): Promise<FirebaseApp> {
  if (!firebaseEnabled) return Promise.reject(new Error('Firebase is not configured'))
  appPromise ??= (async () => {
    const { initializeApp, getApps } = await import('firebase/app')
    const app = getApps()[0] ?? initializeApp(firebaseConfig)
    const siteKey = env.VITE_FIREBASE_APPCHECK_SITE_KEY
    if (siteKey) {
      const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check')
      initializeAppCheck(app, { provider: new ReCaptchaV3Provider(siteKey), isTokenAutoRefreshEnabled: true })
    }
    return app
  })()
  return appPromise
}

export async function getDb() {
  const app = await getFirebaseApp()
  const { getFirestore } = await import('firebase/firestore')
  return getFirestore(app)
}

export async function getAuthInstance() {
  const app = await getFirebaseApp()
  const { getAuth } = await import('firebase/auth')
  return getAuth(app)
}

let analyticsStarted = false
/** Starts Google Analytics for Firebase. Call only after consent. */
export async function startAnalytics() {
  if (analyticsStarted || !firebaseEnabled || !firebaseConfig.measurementId) return
  analyticsStarted = true
  const app = await getFirebaseApp()
  const { getAnalytics, isSupported } = await import('firebase/analytics')
  if (await isSupported()) getAnalytics(app)
}

export async function trackEvent(name: string, params?: Record<string, string | number>) {
  if (!analyticsStarted) return
  const app = await getFirebaseApp()
  const { getAnalytics, logEvent } = await import('firebase/analytics')
  logEvent(getAnalytics(app), name, params)
}
