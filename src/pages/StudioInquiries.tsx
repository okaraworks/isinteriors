import type { User } from 'firebase/auth'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Seo } from '../components/ui/Seo'
import { firebaseEnabled, getAuthInstance, getDb } from '../lib/firebase'

interface Inquiry {
  id: string
  type: string
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
  photoCount: number
  photoStorage?: string
  status: string
  createdAt?: { toDate: () => Date }
}

const STATUSES = ['new', 'contacted', 'scheduled', 'closed'] as const

/**
 * Studio inbox: sign in with Firebase Authentication (email/password) to read
 * inquiries. Access is enforced by firestore.rules — only users listed in the
 * `admins` collection can read or update inquiries.
 */
export default function StudioInquiries() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(!firebaseEnabled)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Inquiry[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const [photos, setPhotos] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!firebaseEnabled) return
    let unsub = () => {}
    getAuthInstance().then(async (auth) => {
      const { onAuthStateChanged } = await import('firebase/auth')
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u)
        setReady(true)
      })
    })
    return () => unsub()
  }, [])

  const load = useCallback(async () => {
    setError(null)
    try {
      const db = await getDb()
      const { collection, getDocs, limit, orderBy, query } = await import('firebase/firestore')
      const snap = await getDocs(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(100)))
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Inquiry, 'id'>) })))
    } catch {
      setError('Could not load inquiries. Check that this account is listed in the admins collection.')
    }
  }, [])

  useEffect(() => {
    if (user) void load()
  }, [user, load])

  const signIn = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const auth = await getAuthInstance()
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Sign-in failed. Check the email and password.')
    }
  }

  const signOutNow = async () => {
    const auth = await getAuthInstance()
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
    setItems([])
  }

  const setStatus = async (id: string, status: string) => {
    const db = await getDb()
    const { doc, updateDoc } = await import('firebase/firestore')
    await updateDoc(doc(db, 'inquiries', id), { status })
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  const loadPhotos = async (inq: Inquiry) => {
    if (photos[inq.id] || !inq.photoCount) return
    const db = await getDb()
    if (inq.photoStorage === 'storage') {
      const { getFirebaseApp } = await import('../lib/firebase')
      const { getStorage, ref, listAll, getDownloadURL } = await import('firebase/storage')
      const res = await listAll(ref(getStorage(await getFirebaseApp()), `inquiries/${inq.id}`))
      const urls = await Promise.all(res.items.map((r) => getDownloadURL(r)))
      setPhotos((p) => ({ ...p, [inq.id]: urls }))
    } else {
      const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
      const snap = await getDocs(query(collection(db, 'inquiries', inq.id, 'photos'), orderBy('index')))
      setPhotos((p) => ({ ...p, [inq.id]: snap.docs.map((d) => d.data().data as string) }))
    }
  }

  return (
    <section className="min-h-[80vh] pt-32 pb-24">
      <Seo title="Studio inquiries" path="/studio/inquiries" noindex />
      <div className="container-editorial">
        <p className="eyebrow">Studio only</p>
        <h1 className="mt-4 text-display-md">Inquiries</h1>

        {!firebaseEnabled && (
          <p className="mt-8 max-w-xl border border-dashed border-taupe px-5 py-4 text-sm text-ink-soft">
            Firebase is not configured yet. Add the VITE_FIREBASE_* values (see README) to receive and manage inquiries here.
          </p>
        )}

        {firebaseEnabled && ready && !user && (
          <form onSubmit={signIn} className="mt-10 max-w-sm space-y-6">
            <label className="block">
              <span className="eyebrow">Email</span>
              <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
            </label>
            <label className="block">
              <span className="eyebrow">Password</span>
              <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
            </label>
            <Button type="submit">Sign in</Button>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-6 text-sm text-[#9a3b2e]">
            {error}
          </p>
        )}

        {user && (
          <div className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 text-sm">
              <span className="text-ink-soft">Signed in as {user.email}</span>
              <div className="flex gap-6">
                <button className="link-underline" onClick={() => void load()}>
                  Refresh
                </button>
                <button className="link-underline" onClick={() => void signOutNow()}>
                  Sign out
                </button>
              </div>
            </div>
            {items.length === 0 && <p className="mt-10 text-ink-soft">No inquiries yet.</p>}
            <ul className="divide-y divide-line">
              {items.map((i) => (
                <li key={i.id} className="py-6">
                  <button
                    className="grid w-full gap-2 text-left sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8"
                    aria-expanded={open === i.id}
                    onClick={() => {
                      setOpen(open === i.id ? null : i.id)
                      void loadPhotos(i)
                    }}
                  >
                    <span>
                      <span className="font-display text-2xl">{i.name}</span>
                      <span className="ml-3 text-xs uppercase tracking-[0.18em] text-taupe">{i.type === 'site-visit' ? 'Site visit' : 'Consultation'}</span>
                    </span>
                    <span className="text-sm text-ink-soft">{i.createdAt?.toDate().toLocaleString()}</span>
                    <span className={`justify-self-start px-3 py-1 text-xs uppercase tracking-[0.15em] ${i.status === 'new' ? 'bg-espresso text-ivory' : 'bg-beige'}`}>{i.status}</span>
                  </button>
                  {open === i.id && (
                    <div className="mt-6 grid gap-8 lg:grid-cols-2">
                      <dl className="grid grid-cols-[9rem_1fr] gap-y-2 text-sm">
                        {(
                          [
                            ['Phone', i.phone],
                            ['Email', i.email],
                            ['Location', i.location],
                            ['Property', i.propertyType],
                            ['Preferred date', i.preferredDate],
                            ['Design', i.design],
                            ['Moodboard', i.moodboard?.join(', ')],
                            ['Estimate', i.estimate],
                          ] as const
                        )
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <div key={k} className="contents">
                              <dt className="text-ink-soft">{k}</dt>
                              <dd>{v}</dd>
                            </div>
                          ))}
                        <dt className="text-ink-soft">Description</dt>
                        <dd className="whitespace-pre-wrap">{i.description}</dd>
                        <dt className="text-ink-soft">Status</dt>
                        <dd>
                          <select value={i.status} onChange={(e) => void setStatus(i.id, e.target.value)} className="border border-line bg-transparent px-2 py-1">
                            {STATUSES.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </dd>
                      </dl>
                      <div className="grid grid-cols-3 gap-2">
                        {(photos[i.id] ?? []).map((src, k) => (
                          <a key={k} href={src} target="_blank" rel="noopener noreferrer">
                            <img src={src} alt={`Photo ${k + 1} from ${i.name}`} className="aspect-square w-full object-cover" loading="lazy" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
