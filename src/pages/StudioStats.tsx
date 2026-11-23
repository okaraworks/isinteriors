import { useEffect, useMemo, useState } from 'react'
import { StatsDashboard, type RANGES } from '../components/studio/StatsDashboard'
import { StudioShell } from '../components/studio/StudioShell'
import { getDb } from '../lib/firebase'
import { aggregate, dayList, sampleData, type InquiryLite, type StatEvent } from '../lib/statsAggregate'

type Range = (typeof RANGES)[number]

function SamplePreview() {
  const [range, setRange] = useState<Range>(30)
  const data = useMemo(() => {
    const s = sampleData(range)
    return aggregate(s.events, s.inquiries, range)
  }, [range])
  return <StatsDashboard data={data} range={range} onRange={setRange} sample />
}

function LiveStats() {
  const [range, setRange] = useState<Range>(30)
  const [raw, setRaw] = useState<{ events: StatEvent[]; inquiries: InquiryLite[] }>({ events: [], inquiries: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const db = await getDb()
        const { collection, getDocs, query, where, Timestamp } = await import('firebase/firestore')
        const from = dayList(range)[0]
        const [ev, inq] = await Promise.all([
          getDocs(query(collection(db, 'events'), where('day', '>=', from))),
          getDocs(query(collection(db, 'inquiries'), where('createdAt', '>=', Timestamp.fromDate(new Date(`${from}T00:00:00Z`))))),
        ])
        if (cancelled) return
        setRaw({
          events: ev.docs.map((d) => d.data() as StatEvent),
          inquiries: inq.docs.map((d) => {
            const x = d.data()
            return { type: x.type, status: x.status, day: x.createdAt?.toDate().toISOString().slice(0, 10) ?? from }
          }),
        })
      } catch {
        if (!cancelled) setError('Could not load stats. Check that this account is listed in the admins collection and the rules are deployed.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [range])

  const data = useMemo(() => aggregate(raw.events, raw.inquiries, range), [raw, range])
  return (
    <>
      {error && (
        <p role="alert" className="mb-6 text-sm text-[#9a3b2e]">
          {error}
        </p>
      )}
      <StatsDashboard data={data} range={range} onRange={setRange} loading={loading} />
    </>
  )
}

export default function StudioStats() {
  return (
    <StudioShell title="Studio dashboard" preview={<SamplePreview />}>
      {() => <LiveStats />}
    </StudioShell>
  )
}
