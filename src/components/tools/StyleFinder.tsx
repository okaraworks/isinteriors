import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { concepts } from '../../data/concepts'
import { quiz } from '../../data/styleQuiz'
import { Artwork } from '../ui/Artwork'
import { Button, ButtonLink } from '../ui/Button'

export function StyleFinder() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const done = step >= quiz.length

  const results = useMemo(() => {
    const totals: Record<string, number> = {}
    answers.forEach((a, qi) => {
      const opt = quiz[qi]?.options[a]
      if (!opt) return
      Object.entries(opt.scores).forEach(([slug, s]) => (totals[slug] = (totals[slug] ?? 0) + s))
    })
    const max = Math.max(1, ...Object.values(totals))
    return concepts
      .map((c) => ({ c, score: totals[c.slug] ?? 0, pct: Math.round(((totals[c.slug] ?? 0) / max) * 100) }))
      .sort((a, b) => b.score - a.score)
  }, [answers])

  const choose = (optIndex: number) => {
    const next = [...answers.slice(0, step), optIndex]
    setAnswers(next)
    setStep(step + 1)
  }
  const restart = () => {
    setAnswers([])
    setStep(0)
  }

  const q = quiz[step]
  const top = results[0]

  return (
    <div className="grid gap-10 lg:grid-cols-12" aria-live="polite">
      <div className="lg:col-span-5">
        <div className="flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink-soft">
          <span>{done ? 'Your result' : `Question ${step + 1} of ${quiz.length}`}</span>
          {step > 0 && !done && (
            <button type="button" className="link-underline" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
        </div>
        <div className="mt-4 h-px w-full bg-line">
          <motion.div className="h-px bg-espresso" animate={{ width: `${(Math.min(step, quiz.length) / quiz.length) * 100}%` }} transition={{ duration: 0.6 }} />
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.fieldset
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <legend className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight">{q.question}</legend>
              <div className="mt-8 grid gap-3">
                {q.options.map((o, i) => (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => choose(i)}
                    className={`group flex items-center gap-4 border px-5 py-4 text-left transition-colors duration-300 hover:border-espresso hover:bg-white ${
                      answers[step] === i ? 'border-espresso bg-white' : 'border-line'
                    }`}
                  >
                    {o.swatch.length > 0 && (
                      <span className="flex shrink-0" aria-hidden>
                        {o.swatch.map((s) => (
                          <span key={s} className="h-8 w-4" style={{ background: s }} />
                        ))}
                      </span>
                    )}
                    <span className="flex-1">
                      <span className="block font-medium">{o.label}</span>
                      {o.hint && <span className="block text-sm text-ink-soft">{o.hint}</span>}
                    </span>
                    <span aria-hidden className="text-taupe transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </motion.fieldset>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-10">
              <p className="eyebrow">Your closest match</p>
              <h3 className="mt-4 text-display-sm">{top.c.name}</h3>
              <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-taupe">{top.c.style}</p>
              <p className="mt-5 text-ink-soft">{top.c.summary}</p>
              <div className="mt-6 flex gap-1" aria-label="Palette">
                {top.c.palette.map((s) => (
                  <span key={s.hex} className="h-8 flex-1" style={{ background: s.hex }} title={s.name} />
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to={`/designs/${top.c.slug}`}>View this design</ButtonLink>
                <ButtonLink to={`/book-a-site-visit?type=consultation&design=${top.c.slug}`} variant="outline">
                  Request This Design
                </ButtonLink>
              </div>
              <p className="mt-8 text-sm text-ink-soft">
                Also consider{' '}
                {results.slice(1, 3).map((r, i) => (
                  <span key={r.c.slug}>
                    {i > 0 && ' and '}
                    <Link to={`/designs/${r.c.slug}`} className="link-underline text-espresso">
                      {r.c.name}
                    </Link>
                  </span>
                ))}
                .
              </p>
              <Button variant="text" className="mt-4" onClick={restart}>
                Start again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`lg:col-span-6 lg:col-start-7 ${done ? '' : 'max-lg:hidden'}`}>
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
          <AnimatePresence initial={false}>
            <motion.div
              key={done ? top.c.slug : `q${step}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Artwork
                conceptSlug={done ? top.c.slug : results[0].score > 0 ? results[0].c.slug : concepts[step % concepts.length].slug}
                room={done ? undefined : (['living', 'bedroom', 'dining', 'kitchen', 'vignette'] as const)[step % 5]}
                alt={done ? `${top.c.name} interior` : 'Interior inspiration'}
                zoom={false}
                className="h-full w-full"
              />
            </motion.div>
          </AnimatePresence>
          {done && (
            <div className="absolute bottom-0 left-0 bg-ivory px-5 py-4">
              <p className="font-display text-4xl leading-none">{top.pct}%</p>
              <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">Match</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
