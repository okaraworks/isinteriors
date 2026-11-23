import type { User } from 'firebase/auth'
import { useState, type FormEvent, type ReactNode } from 'react'
import { NavLink } from 'react-router'
import { useStudioAuth } from '../../hooks/useStudioAuth'
import { firebaseEnabled } from '../../lib/firebase'
import { Button } from '../ui/Button'
import { Seo } from '../ui/Seo'

/** Staff-only frame: sign-in, tabs, and the signed-in user passed to the page. */
export function StudioShell({ title, preview, children }: { title: string; preview?: ReactNode; children: (user: User) => ReactNode }) {
  const { user, ready, signIn, signOut } = useStudioAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await signIn(email, password)
    } catch {
      setError('Sign-in failed. Check the email and password.')
    }
  }

  const tab = ({ isActive }: { isActive: boolean }) =>
    `-mb-px pb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${isActive ? 'border-b border-espresso text-espresso' : 'text-ink-soft hover:text-espresso'}`

  return (
    <section className="min-h-[80vh] pt-32 pb-24">
      <Seo title={title} path="/studio" noindex />
      <div className="container-editorial">
        <p className="eyebrow">Studio only</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h1 className="text-display-md">{title}</h1>
          {user && (
            <div className="flex items-center gap-6 text-sm">
              <span className="text-ink-soft">{user.email}</span>
              <button className="link-underline" onClick={() => void signOut()}>
                Sign out
              </button>
            </div>
          )}
        </div>
        <nav aria-label="Studio" className="mt-8 flex gap-8 border-b border-line">
          <NavLink to="/studio" end className={tab}>
            Stats
          </NavLink>
          <NavLink to="/studio/inquiries" className={tab}>
            Inquiries
          </NavLink>
        </nav>

        {!firebaseEnabled && (
          <>
            <p className="mt-10 max-w-2xl border border-dashed border-taupe px-5 py-4 text-sm text-ink-soft">
              Firebase is not connected in this build, so nothing is being collected. In the live build (with the VITE_FIREBASE_* values in .env) staff sign in here.
              {preview ? ' Below is a preview with sample numbers so you can see the layout.' : ''}
            </p>
            {preview && <div className="mt-10">{preview}</div>}
          </>
        )}

        {firebaseEnabled && ready && !user && (
          <form onSubmit={submit} className="mt-10 max-w-sm space-y-6">
            <label className="block">
              <span className="eyebrow">Email</span>
              <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
            </label>
            <label className="block">
              <span className="eyebrow">Password</span>
              <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
            </label>
            {error && (
              <p role="alert" className="text-sm text-[#9a3b2e]">
                {error}
              </p>
            )}
            <Button type="submit">Sign in</Button>
          </form>
        )}

        {user && <div className="mt-10">{children(user)}</div>}
      </div>
    </section>
  )
}
