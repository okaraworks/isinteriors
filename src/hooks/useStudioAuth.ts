import type { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { firebaseEnabled, getAuthInstance } from '../lib/firebase'

/** Firebase Auth state for the staff-only studio area. */
export function useStudioAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(!firebaseEnabled)

  useEffect(() => {
    if (!firebaseEnabled) return
    let unsub = () => {}
    void getAuthInstance().then(async (auth) => {
      const { onAuthStateChanged } = await import('firebase/auth')
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u)
        setReady(true)
      })
    })
    return () => unsub()
  }, [])

  const signIn = async (email: string, password: string) => {
    const auth = await getAuthInstance()
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword(auth, email, password)
  }
  const signOut = async () => {
    const auth = await getAuthInstance()
    const { signOut: so } = await import('firebase/auth')
    await so(auth)
  }
  return { user, ready, signIn, signOut }
}
