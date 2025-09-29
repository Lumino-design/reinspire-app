import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { BreathingVisualizer } from './BreathingVisualizer'
import { formatSeconds } from '../utils/date'

type SessionProps = {
  rpSeconds: number
  onBack: () => void
  onComplete: () => void
  onCancel: () => void
}

type SessionState = 'idle' | 'running' | 'finished'

type Segment =
  | {
      kind: 'breathe'
      label: 'Inhale' | 'Exhale'
      duration: number
      round: number
      segmentIndex: number
    }
  | {
      kind: 'hold'
      duration: number
      round: number
    }

const HOLD_ADJUSTMENTS = [-4, -2, 0, 2, 4]
const MIN_HOLD = 5
const BREATHING_PATTERN: { label: 'Inhale' | 'Exhale'; duration: number }[] = [
  { label: 'Inhale', duration: 4 },
  { label: 'Exhale', duration: 6 },
  { label: 'Inhale', duration: 4 },
  { label: 'Exhale', duration: 6 },
]

export function TrainingSession({ rpSeconds, onBack, onComplete, onCancel }: SessionProps) {
  const [sessionState, setSessionState] = useState<SessionState>('idle')
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [segmentMetrics, setSegmentMetrics] = useState({ remaining: 0, progress: 0 })
  const completionNotified = useRef(false)
  const frameRef = useRef<number | null>(null)

  const segments = useMemo<Segment[]>(() => {
    return HOLD_ADJUSTMENTS.flatMap((adjustment, index) => {
      const round = index + 1
      const hold = Math.max(MIN_HOLD, rpSeconds + adjustment)
      const breathingSegments: Segment[] = BREATHING_PATTERN.map((pattern, patternIndex) => ({
        kind: 'breathe',
        label: pattern.label,
        duration: pattern.duration,
        round,
        segmentIndex: patternIndex,
      }))
      return [...breathingSegments, { kind: 'hold', duration: hold, round }]
    })
  }, [rpSeconds])

  const clearFrame = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }

  useEffect(() => {
    if (sessionState !== 'running') {
      clearFrame()
      return
    }

    const segment = segments[segmentIndex]
    if (!segment) {
      setSessionState('finished')
      return
    }

    const startAt = performance.now()
    const durationMs = segment.duration * 1000
    setSegmentMetrics({ remaining: segment.duration, progress: 0 })

    const tick = () => {
      const elapsed = performance.now() - startAt
      const progress = Math.min(1, elapsed / durationMs)
      const remaining = Math.max(0, segment.duration - elapsed / 1000)

      setSegmentMetrics({ remaining, progress })

      if (elapsed >= durationMs) {
        setSegmentIndex((prev) => prev + 1)
        return
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)

    return clearFrame
  }, [segmentIndex, segments, sessionState])

  useEffect(() => {
    if (sessionState === 'finished' && !completionNotified.current) {
      completionNotified.current = true
      onComplete()
    }
  }, [sessionState, onComplete])

  const handleBegin = () => {
    completionNotified.current = false
    setSegmentIndex(0)
    setSegmentMetrics({ remaining: segments[0]?.duration ?? 0, progress: 0 })
    setSessionState('running')
  }

  const handleStop = () => {
    completionNotified.current = false
    clearFrame()
    setSessionState('idle')
    setSegmentIndex(0)
    setSegmentMetrics({ remaining: 0, progress: 0 })
    onCancel()
  }

  const totalRounds = HOLD_ADJUSTMENTS.length
  const currentSegment = sessionState === 'running' ? segments[segmentIndex] ?? null : null

  const summaryRows = HOLD_ADJUSTMENTS.map((adjustment, index) => {
    const round = index + 1
    const hold = Math.max(MIN_HOLD, rpSeconds + adjustment)
    return { round, hold }
  })

  const roundLabel = currentSegment?.round ?? segments[segments.length - 1]?.round ?? 1

  const visualizerMode =
    currentSegment?.kind === 'breathe'
      ? currentSegment.label === 'Inhale'
        ? 'inhale'
        : 'exhale'
      : 'hold'

  const secondsRemaining = segmentMetrics.remaining
  const totalSeconds = currentSegment?.duration ?? 0

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
          Alternate two paced breathing cycles with progressive holds based on your relaxed pause.
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
                    <span className="text-white/80">20s</span>
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

        {sessionState === 'running' && currentSegment && (
          <div className="mt-8 flex flex-col items-center gap-6 rounded-2xl bg-sanctuary-soft/70 p-10 text-center shadow-glow">
            <span className="text-sm uppercase tracking-[0.3em] text-white/40">
              Round {roundLabel} of {totalRounds}
            </span>

            {currentSegment.kind === 'breathe' ? (
              <>
                <p className="text-xl text-white/70">{currentSegment.label}</p>
                <BreathingVisualizer
                  mode={visualizerMode}
                  secondsRemaining={secondsRemaining}
                  totalSeconds={totalSeconds}
                  progress={segmentMetrics.progress}
                />
                <p className="text-sm text-white/50">
                  Cycle {currentSegment.segmentIndex < 2 ? 1 : 2} of 2
                </p>
              </>
            ) : (
              <>
                <p className="text-xl text-white/70">Hold</p>
                <BreathingVisualizer
                  mode="hold"
                  secondsRemaining={secondsRemaining}
                  totalSeconds={totalSeconds}
                  progress={segmentMetrics.progress}
                />
                <p className="text-sm text-white/50">Stay calm, breathe in gently when ready.</p>
              </>
            )}

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