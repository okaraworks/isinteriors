import { integrations } from '../config/integrations'

const cfg = () => integrations.cloudinary

/** Optimised delivery URL for an image already in Cloudinary (auto format + quality). */
export function cloudinaryUrl(publicId: string, width: number) {
  const c = cfg()
  if (!c) return null
  return `https://res.cloudinary.com/${c.cloudName}/image/upload/f_auto,q_auto,c_limit,w_${width}/${publicId}`
}

/** src + srcSet for responsive project imagery stored in Cloudinary. */
export function cloudinaryImage(publicId: string, widths = [640, 1024, 1600, 2400]) {
  if (!cfg()) return null
  return {
    src: cloudinaryUrl(publicId, 1600)!,
    srcSet: widths.map((w) => `${cloudinaryUrl(publicId, w)} ${w}w`).join(', '),
  }
}

export const cloudinaryUploadsEnabled = () => Boolean(cfg()?.uploadPreset)

/**
 * Upload an inquiry photo with an UNSIGNED preset. Configure the preset in
 * Cloudinary to: folder "inquiries", allowed formats jpg/png/webp, max file
 * size 10 MB, and strip metadata (incoming transformation), so it cannot be
 * abused as general-purpose hosting.
 */
export async function uploadToCloudinary(file: File | string, inquiryRef: string): Promise<string> {
  const c = cfg()
  if (!c?.uploadPreset) throw new Error('Cloudinary uploads are not configured')
  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', c.uploadPreset)
  body.append('tags', `inquiry,${inquiryRef}`)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(c.cloudName)}/image/upload`, { method: 'POST', body })
  if (!res.ok) throw new Error(`Photo upload failed (${res.status})`)
  const json = (await res.json()) as { secure_url?: string }
  if (!json.secure_url?.startsWith('https://res.cloudinary.com/')) throw new Error('Unexpected upload response')
  return json.secure_url
}
