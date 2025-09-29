import { describeDateDifference, formatSeconds } from '../utils/date'

type SanctuaryProps = {
  rpSeconds: number | null
  streak: number
  lastCalibrationDate: string | null
  onStartSession: () => void
  onCalibrate: () => void
}

export function Sanctuary({
  rpSeconds,
  streak,
  lastCalibrationDate,
  onStartSession,
  onCalibrate,
}: SanctuaryProps) {
  const friendlyDate = describeDateDifference(lastCalibrationDate)
  const hasRp = typeof rpSeconds === 'number' && !Number.isNaN(rpSeconds)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sanctuary-base px-6 py-10 text-slate-100">
      <div className="w-full max-w-xl rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur">
        <header className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-white/40">Re-In Spire</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Sanctuary</h1>
          <p className="mt-2 text-white/60">
            Drift into calm, measure your breath, and train your resilience.
          </p>
        </header>

        <section className="mb-8 grid gap-4 rounded-2xl bg-sanctuary-soft/60 p-6 shadow-glow">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
              Last Relaxed Pause
            </span>
            <span className="text-3xl font-semibold text-white">
              {hasRp ? formatSeconds(rpSeconds!) : '-'}
            </span>
            {friendlyDate && (
              <span className="text-sm text-white/40">Measured {friendlyDate}</span>
            )}
            {!friendlyDate && !hasRp && (
              <span className="text-sm text-white/40">
                Calibrate your relaxed pause to begin.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">Streak</span>
            <span className="text-3xl font-semibold text-white">{streak} day{streak === 1 ? '' : 's'}</span>
          </div>
        </section>

        <div className="flex flex-col gap-3">
          {hasRp ? (
            <>
              <button
                type="button"
                onClick={onStartSession}
                className="rounded-full bg-white/90 px-6 py-3 text-base font-medium text-sanctuary-base transition hover:bg-white"
              >
                Start Today&apos;s Session
              </button>
              <button
                type="button"
                onClick={onCalibrate}
                className="text-sm font-medium text-white/50 transition hover:text-white"
              >
                Recalibrate
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onCalibrate}
              className="rounded-full bg-white/90 px-6 py-3 text-base font-medium text-sanctuary-base transition hover:bg-white"
            >
              Calibrate Your Breathing
            </button>
          )}
        </div>
      </div>
    </div>
  )
}