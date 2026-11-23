import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { conceptBySlug } from '../../data/concepts'
import { allMoodItems } from '../../data/moodboard'
import { submitInquiry, type InquiryType } from '../../lib/inquiries'
import { whatsappLink, whatsappMessages } from '../../lib/whatsapp'
import { Button, ButtonLink } from '../ui/Button'

export const propertyTypes = ['Apartment', 'House / Villa', 'Penthouse', 'Office', 'Retail / Showroom', 'Hotel', 'Restaurant / Bar', 'Other'] as const

const MAX_PHOTOS = 6
const MAX_PHOTO_MB = 10
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

const today = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

const schema = z.object({
  name: z.string().trim().min(2, { error: 'Please enter your full name.' }).max(120),
  phone: z
    .string()
    .trim()
    .min(7, { error: 'Please enter a phone number we can reach you on.' })
    .max(40)
    .regex(/^\+?[\d\s().-]{7,}$/, { error: 'Use digits, spaces and an optional leading +.' }),
  email: z.string().trim().max(160).pipe(z.email({ error: 'Please enter a valid email address.' })),
  location: z.string().trim().min(2, { error: 'Tell us where the property is (area or city).' }).max(200),
  propertyType: z.enum(propertyTypes, { error: 'Please choose a property type.' }),
  preferredDate: z
    .string()
    .min(1, { error: 'Choose a preferred date.' })
    .refine((v) => v >= today(), { error: 'Please choose today or a future date.' }),
  description: z.string().trim().min(20, { error: 'A sentence or two about the project helps us prepare (20+ characters).' }).max(4000),
  consent: z.literal(true, { error: 'Please agree so we can contact you about your enquiry.' }),
  company: z.string().max(0).optional(), // honeypot
})

type FormValues = z.input<typeof schema>

function Field({ label, error, children, hint, htmlFor, className = '' }: { label: string; error?: string; hint?: string; children: ReactNode; htmlFor: string; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="eyebrow block !text-espresso/70">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-xs text-ink-soft">{hint}</p>}
      <AnimatePresence>
        {error && (
          <motion.p id={`${htmlFor}-error`} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs text-[#9a3b2e]">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

interface Props {
  initialType?: InquiryType
  design?: string
  moodboard?: string[]
  estimate?: string
}

export function SiteVisitForm({ initialType = 'site-visit', design, moodboard = [], estimate }: Props) {
  const uid = useId()
  const id = (n: string) => `${uid}-${n}`
  const [type, setType] = useState<InquiryType>(initialType)
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([])
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [progress, setProgress] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)
  const [result, setResult] = useState<{ id: string; mode: 'firebase' | 'demo' } | null>(null)
  const startedAt = useRef(0)
  const fileInput = useRef<HTMLInputElement>(null)
  const concept = conceptBySlug(design)
  const moodItems = moodboard.map((m) => allMoodItems.find((i) => i.id === m)).filter(Boolean)

  const [prevInitial, setPrevInitial] = useState(initialType)
  if (prevInitial !== initialType) {
    setPrevInitial(initialType)
    setType(initialType)
  }
  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      description: concept ? `I am interested in the ${concept.name} design for my space. ` : '',
      propertyType: undefined,
    },
  })

  // Revoke preview URLs when the form unmounts.
  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), [])

  const addFiles = (list: FileList | null) => {
    if (!list) return
    setPhotoError(null)
    const next = [...photos]
    for (const f of Array.from(list)) {
      if (!ACCEPTED.includes(f.type)) {
        setPhotoError(`${f.name}: please upload JPG, PNG or WebP images.`)
        continue
      }
      if (f.size > MAX_PHOTO_MB * 1024 * 1024) {
        setPhotoError(`${f.name} is larger than ${MAX_PHOTO_MB} MB.`)
        continue
      }
      if (next.length >= MAX_PHOTOS) {
        setPhotoError(`You can attach up to ${MAX_PHOTOS} photos.`)
        break
      }
      if (!next.some((x) => x.file.name === f.name && x.file.size === f.size)) next.push({ file: f, url: URL.createObjectURL(f) })
    }
    setPhotos(next)
    if (fileInput.current) fileInput.current.value = ''
  }

  const removePhoto = (f: File) => {
    setPhotos((p) => {
      p.filter((x) => x.file === f).forEach((x) => URL.revokeObjectURL(x.url))
      return p.filter((x) => x.file !== f)
    })
  }

  const onSubmit = async (values: FormValues) => {
    // Bots typically fill hidden fields or submit instantly.
    if (values.company || Date.now() - startedAt.current < 2500) {
      setStatus('sent')
      setResult({ id: 'ok', mode: 'demo' })
      return
    }
    setStatus('sending')
    setServerError(null)
    try {
      const r = await submitInquiry(
        {
          type,
          name: values.name,
          phone: values.phone,
          email: values.email,
          location: values.location,
          propertyType: values.propertyType,
          preferredDate: values.preferredDate,
          description: values.description,
          design: concept?.slug,
          moodboard,
          estimate,
          photos: photos.map((p) => p.file),
        },
        setProgress,
      )
      setResult(r)
      setStatus('sent')
      reset()
      photos.forEach((p) => URL.revokeObjectURL(p.url))
      setPhotos([])
    } catch (e) {
      setStatus('error')
      setServerError(e instanceof Error && e.message.startsWith('You have') ? e.message : 'Something went wrong sending your request. Please try again, or contact the studio directly.')
      if (import.meta.env.DEV) console.error(e)
    }
  }

  const onInvalid = (errs: Record<string, unknown>) => {
    const first = Object.keys(errs)[0] as keyof FormValues | undefined
    if (first) setFocus(first)
  }

  const wa = whatsappLink(whatsappMessages.siteVisit)

  if (status === 'sent' && result) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-line bg-white p-8 sm:p-12" role="status">
        <p className="eyebrow">Request received</p>
        <h2 className="mt-5 text-display-sm">Thank you. We will be in touch shortly.</h2>
        <p className="mt-5 max-w-lg text-ink-soft">
          {type === 'site-visit'
            ? 'A member of the studio will contact you to confirm your site visit date and anything we should know before we arrive.'
            : 'A member of the studio will contact you to arrange your consultation.'}
        </p>
        {result.mode === 'demo' && (
          <p className="mt-6 inline-block border border-dashed border-taupe px-4 py-2 text-xs text-taupe">
            Preview mode: the form backend is not connected yet, so this request was not sent.
          </p>
        )}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/designs">Explore Our Designs</ButtonLink>
          <Button
            variant="outline"
            onClick={() => {
              setStatus('idle')
              setResult(null)
              startedAt.current = Date.now()
            }}
          >
            Send another request
          </Button>
        </div>
      </motion.div>
    )
  }

  const describedBy = (n: keyof FormValues) => (errors[n] ? `${id(n)}-error` : undefined)

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-10">
      <fieldset>
        <legend className="eyebrow mb-4">I would like to</legend>
        <div className="grid grid-cols-2 border border-line" role="radiogroup">
          {(
            [
              ['site-visit', 'Book a site visit'],
              ['consultation', 'Request a consultation'],
            ] as const
          ).map(([v, label]) => (
            <label key={v} className={`cursor-pointer px-4 py-4 text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-colors ${type === v ? 'bg-espresso text-ivory' : 'hover:bg-beige/50'}`}>
              <input type="radio" name="inquiry-type" value={v} checked={type === v} onChange={() => setType(v)} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {(concept || moodItems.length > 0 || estimate) && (
        <div className="space-y-2 border-l-2 border-taupe bg-beige/40 px-5 py-4 text-sm">
          <p className="eyebrow">Attached to your request</p>
          {concept && <p>Design: <strong className="font-medium">{concept.name}</strong> ({concept.style})</p>}
          {moodItems.length > 0 && <p>Moodboard: {moodItems.map((m) => m!.label).join(', ')}</p>}
          {estimate && <p>Budget estimate: {estimate}</p>}
        </div>
      )}

      <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
        <Field label="Full name" htmlFor={id('name')} error={errors.name?.message}>
          <input id={id('name')} autoComplete="name" className="field-input" aria-invalid={!!errors.name} aria-describedby={describedBy('name')} {...register('name')} />
        </Field>
        <Field label="Phone" htmlFor={id('phone')} error={errors.phone?.message}>
          <input id={id('phone')} type="tel" autoComplete="tel" inputMode="tel" className="field-input" aria-invalid={!!errors.phone} aria-describedby={describedBy('phone')} {...register('phone')} />
        </Field>
        <Field label="Email" htmlFor={id('email')} error={errors.email?.message}>
          <input id={id('email')} type="email" autoComplete="email" className="field-input" aria-invalid={!!errors.email} aria-describedby={describedBy('email')} {...register('email')} />
        </Field>
        <Field label="Property location" htmlFor={id('location')} error={errors.location?.message} hint="Area and city is enough for now.">
          <input id={id('location')} autoComplete="address-level2" className="field-input" aria-invalid={!!errors.location} aria-describedby={describedBy('location')} {...register('location')} />
        </Field>
        <Field label="Property type" htmlFor={id('propertyType')} error={errors.propertyType?.message}>
          <select id={id('propertyType')} defaultValue="" className="field-input appearance-none" aria-invalid={!!errors.propertyType} aria-describedby={describedBy('propertyType')} {...register('propertyType')}>
            <option value="" disabled>
              Select…
            </option>
            {propertyTypes.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label={type === 'site-visit' ? 'Preferred visit date' : 'Preferred consultation date'} htmlFor={id('preferredDate')} error={errors.preferredDate?.message}>
          <input id={id('preferredDate')} type="date" min={today()} className="field-input" aria-invalid={!!errors.preferredDate} aria-describedby={describedBy('preferredDate')} {...register('preferredDate')} />
        </Field>
        <Field label="Project description" htmlFor={id('description')} error={errors.description?.message} className="sm:col-span-2" hint="Rooms involved, timing, what you would like to change.">
          <textarea id={id('description')} rows={5} className="field-input resize-y" aria-invalid={!!errors.description} aria-describedby={describedBy('description')} {...register('description')} />
        </Field>
      </div>

      <div>
        <p className="eyebrow !text-espresso/70" id={id('photos-label')}>
          Photos of the space <span className="normal-case tracking-normal text-ink-soft">(optional)</span>
        </p>
        <div
          className="mt-4 border border-dashed border-espresso/30 p-6 text-center transition-colors hover:border-espresso"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            addFiles(e.dataTransfer.files)
          }}
        >
          <input ref={fileInput} id={id('photos')} type="file" accept={ACCEPTED.join(',')} multiple className="sr-only" aria-labelledby={id('photos-label')} aria-describedby={id('photos-hint')} onChange={(e) => addFiles(e.target.files)} />
          <label htmlFor={id('photos')} className="inline-flex cursor-pointer items-center gap-3 border border-espresso px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] hover:bg-espresso hover:text-ivory">
            Add photos
          </label>
          <p id={id('photos-hint')} className="mt-3 text-xs text-ink-soft">
            Drag and drop or browse. Up to {MAX_PHOTOS} images, JPG, PNG or WebP, {MAX_PHOTO_MB} MB each. Location data is removed before upload.
          </p>
        </div>
        {photoError && (
          <p role="alert" className="mt-2 text-xs text-[#9a3b2e]">
            {photoError}
          </p>
        )}
        {photos.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {photos.map(({ file: f, url }) => (
              <li key={f.name + f.size} className="group relative aspect-square overflow-hidden bg-beige">
                <img src={url} alt={`Selected photo ${f.name}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => removePhoto(f)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-espresso/80 text-xs text-ivory" aria-label={`Remove ${f.name}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" {...register('company')} />
        </label>
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-espresso" aria-invalid={!!errors.consent} aria-describedby={describedBy('consent')} {...register('consent')} />
          <span>
            I agree that ISOE Interiors may store these details and contact me about this enquiry. See our{' '}
            <ButtonLink to="/privacy" variant="text" arrow={false} className="!inline !p-0 !text-sm !normal-case !tracking-normal">
              privacy notice
            </ButtonLink>
            .
          </span>
        </label>
        {errors.consent && (
          <p id={`${id('consent')}-error`} role="alert" className="mt-2 text-xs text-[#9a3b2e]">
            {errors.consent.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="border-l-2 border-[#9a3b2e] bg-[#9a3b2e]/5 px-4 py-3 text-sm text-[#9a3b2e]">
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" arrow disabled={status === 'sending'} className="sm:min-w-64">
          {status === 'sending' ? progress || 'Sending…' : type === 'site-visit' ? 'Book a Site Visit' : 'Request a Consultation'}
        </Button>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline text-sm">
            Prefer WhatsApp? Message the studio ↗
          </a>
        )}
      </div>
    </form>
  )
}
