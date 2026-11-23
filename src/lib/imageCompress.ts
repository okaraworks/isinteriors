/**
 * Resize and re-encode a photo in the browser. Re-encoding also strips EXIF
 * metadata (including GPS location) before anything is uploaded.
 */
export async function compressImage(file: File, maxDim = 1600, maxBase64Length = 850_000): Promise<{ dataUrl: string; width: number; height: number }> {
  const bitmap = await createImageBitmap(file).catch(async () => {
    // Fallback for browsers without createImageBitmap support for this type
    const url = URL.createObjectURL(file)
    try {
      const img = new Image()
      img.src = url
      await img.decode()
      return img
    } finally {
      URL.revokeObjectURL(url)
    }
  })
  let dim = maxDim
  let quality = 0.8
  for (let attempt = 0; attempt < 8; attempt++) {
    const scale = Math.min(1, dim / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(bitmap, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/jpeg', maxDim > 2000 ? Math.max(quality, 0.88) : quality)
    if (dataUrl.length <= maxBase64Length) return { dataUrl, width: w, height: h }
    if (quality > 0.55) quality -= 0.1
    else dim = Math.round(dim * 0.8)
  }
  throw new Error('This photo could not be reduced enough to upload. Please try a smaller image.')
}
