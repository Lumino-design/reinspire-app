import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { formatSeconds } from '../utils/date'

type SessionProps = {
  rpSeconds: number
  onBack: () => void
  onComplete: () => void
  onCancel: () => void
}

type SessionState = 'idle' | 'running' | 'finished'

type Phase = {
  type: 'rest' | 'hold'
  duration: number
  round: number
}

const REST_DURATION = 20
const HOLD_ADJUSTMENTS = [-4, -2, 0, 2, 4]
const MIN_HOLD = 5

export function TrainingSession({ rpSeconds, onBack, onComplete, onCancel }: SessionProps) {
  const [sessionState, setSessionState] = useState<SessionState>('idle')
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const completionNotified = useRef(false)

  const phases = useMemo<Phase[]>(() => {
    return HOLD_ADJUSTMENTS.flatMap((adjustment, index) => {
      const round = index + 1
      const hold = Math.max(MIN_HOLD, rpSeconds + adjustment)
      return [
        { type: 'rest', duration: REST_DURATION, round },
        { type: 'hold', duration: hold, round },
      ]
    })
  }, [rpSeconds])

  useEffect(() => {
    if (sessionState !== 'running') return
    const phase = phases[currentPhaseIndex]
    if (!phase) return

    const interval = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval)
          setCurrentPhaseIndex((prevIndex) => prevIndex + 1)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [sessionState, currentPhaseIndex, phases])

  useEffect(() => {
    const phase = phases[currentPhaseIndex]
    if (!phase) {
      if (sessionState === 'running') {
        setSessionState('finished')
      }
      return
    }
    setTimeRemaining(phase.duration)
  }, [currentPhaseIndex, phases, sessionState])

  useEffect(() => {
    if (sessionState === 'finished' && !completionNotified.current) {
      completionNotified.current = true
      onComplete()
    }
  }, [sessionState, onComplete])

  const handleBegin = () => {
    completionNotified.current = false
    setSessionState('running')
    setCurrentPhaseIndex(0)
    setTimeRemaining(phases[0]?.duration ?? 0)
  }

  const handleStop = () => {
    completionNotified.current = false
    setSessionState('idle')
    setCurrentPhaseIndex(0)
    setTimeRemaining(0)
    onCancel()
  }

  const phase = phases[currentPhaseIndex] ?? null
  const totalRounds = HOLD_ADJUSTMENTS.length
  const isRunning = sessionState === 'running'

  const summaryRows = HOLD_ADJUSTMENTS.map((adjustment, index) => {
    const round = index + 1
    const hold = Math.max(MIN_HOLD, rpSeconds + adjustment)
    return { round, hold }
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-slate-100">
      <div className="w-full max-w-2xl rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-sm text-white/50 transition hover:text-white"
        >
          &lt; Back to Sanctuary
        </button>

        <h2 className="text-3xl font-semibold text-white">CO2 Tolerance Session</h2>
        <p className="mt-2 text-white/60">
          Alternate 20 second breathing windows with progressive holds based on your relaxed pause.
        </p>

        {sessionState === 'idle' && (
          <>
            <section className="mt-8 rounded-2xl bg-sanctuary-soft/70 p-6 shadow-glow">
              <h3 className="text-lg font-medium text-white">Session Blueprint</h3>
              <p className="mt-1 text-sm text-white/50">Relaxed pause: {formatSeconds(rpSeconds)}</p>
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                <span className="text-white/40">Round</span>
                <span className="text-white/40">Breathe</span>
                <span className="text-white/40">Hold</span>
                {summaryRows.map(({ round, hold }) => (
                  <Fragment key={round}>
                    <span className="font-medium text-white">{round}</span>
                    <span className="text-white/80">{REST_DURATION}s</span>
                    <span className="text-white/80">{hold}s</span>
                  </Fragment>
                ))}
              </div>
            </section>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={handleBegin}
                className="flex-1 rounded-full bg-white/90 px-6 py-3 text-base font-medium text-sanctuary-base transition hover:bg-white"
              >
                Begin Session
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-full border border-white/20 px-6 py-3 text-base font-medium text-white transition hover:border-white/40"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {isRunning && phase && (
          <div className="mt-8 flex flex-col items-center gap-6 rounded-2xl bg-sanctuary-soft/70 p-10 text-center shadow-glow">
            <span className="text-sm uppercase tracking-[0.3em] text-white/40">
              Round {phase.round} of {totalRounds}
            </span>
            <span className="text-xl text-white/70">{phase.type === 'rest' ? 'Breathe' : 'Hold'}</span>
            <span className="text-6xl font-semibold text-white">{timeRemaining}s</span>
            <button
              type="button"
              onClick={handleStop}
              className="rounded-full border border-white/20 px-6 py-2 text-sm font-medium text-white transition hover:border-white/40"
            >
              Stop Session
            </button>
          </div>
        )}

        {sessionState === 'finished' && (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-sanctuary-soft/70 p-10 text-center shadow-glow">
            <p className="text-lg font-medium text-white">Session complete</p>
            <p className="text-white/60">A quiet nervous system is a practiced one. Come back tomorrow to continue your streak.</p>
            <button
              type="button"
              onClick={onBack}
              className="rounded-full bg-white/90 px-6 py-3 text-base font-medium text-sanctuary-base transition hover:bg-white"
            >
              Return to Sanctuary
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
