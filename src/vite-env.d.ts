/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_ROUTER?: 'browser' | 'hash'
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string
  readonly VITE_FIREBASE_APPCHECK_SITE_KEY?: string
  readonly VITE_PHOTO_UPLOAD_MODE?: 'firestore' | 'storage'
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly VITE_CAL_LINK?: string
  readonly VITE_CALENDLY_URL?: string
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_TEMPLATE_ID?: string
  readonly VITE_FORMSPREE_FORM_ID?: string
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string
  readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string
  readonly VITE_CLARITY_PROJECT_ID?: string
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string
  readonly VITE_BING_SITE_VERIFICATION?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_STUDIO_PHONE?: string
  readonly VITE_STUDIO_EMAIL?: string
}
