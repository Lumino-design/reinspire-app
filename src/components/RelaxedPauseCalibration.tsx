import { useEffect, useRef, useState } from 'react'
import { formatSeconds } from '../utils/date'

type CalibrationProps = {
  onBack: () => void
  onSave: (seconds: number) => void
}

type TimerState = 'idle' | 'running' | 'finished'

export function RelaxedPauseCalibration({ onBack, onSave }: CalibrationProps) {
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (timerState !== 'running') {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      return
    }

    const startAt = performance.now()
    startRef.current = startAt

    const tick = () => {
      setElapsed((performance.now() - startAt) / 1000)
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [timerState])

  const handleStart = () => {
    setElapsed(0)
    setTimerState('running')
  }

  const handleStop = () => {
    if (timerState !== 'running' || startRef.current === null) return
    const finalElapsed = (performance.now() - startRef.current) / 1000
    setElapsed(finalElapsed)
    setTimerState('finished')
  }

  const handleReset = () => {
    setTimerState('idle')
    setElapsed(0)
  }

  const handleSave = () => {
    if (elapsed <= 0) return
    onSave(Math.round(elapsed))
    setTimerState('idle')
    setElapsed(0)
  }

  const displayTime = elapsed >= 60 ? formatSeconds(elapsed) : `${elapsed.toFixed(1)}s`

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-10 text-slate-100">
      <div className="w-full max-w-xl rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-sm text-white/50 transition hover:text-white"
        >
          &lt; Back to Sanctuary
        </button>

        <h2 className="text-3xl font-semibold text-white">Relaxed Pause Calibration</h2>
        <p className="mt-2 text-white/60">
          Breathe normally, exhale gently, then press start. Hold until the first
          gentle urge to inhale and release when you sense it.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-sanctuary-soft/70 p-8 text-center shadow-glow">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">Timer</p>
          <p className="text-6xl font-semibold text-white">{displayTime}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleStart}
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={timerState === 'running'}
            >
              Start
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={timerState !== 'running'}
            >
              Stop
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={timerState === 'running' && elapsed < 0.5}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={elapsed <= 0}
            className="rounded-full bg-white/90 px-6 py-3 text-base font-medium text-sanctuary-base transition hover:bg-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
          >
            Save Relaxed Pause
          </button>
          <p className="text-xs text-white/40">
            Saving overwrites your previous relaxed pause and updates today&apos;s measurement.
          </p>
        </div>
      </div>
    </div>
  )
}
