import type { CSSProperties } from 'react'

type VisualizerMode = 'inhale' | 'exhale' | 'hold'

type BreathingVisualizerProps = {
  mode: VisualizerMode
  secondsRemaining: number
  totalSeconds: number
  progress: number
}

const MIN_SCALE = 0.85
const MAX_SCALE = 1.25
const HOLD_SCALE = 1.1

export function BreathingVisualizer({
  mode,
  secondsRemaining,
  totalSeconds,
  progress,
}: BreathingVisualizerProps) {
  let scale = HOLD_SCALE
  if (mode === 'inhale') {
    scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * Math.min(1, progress)
  } else if (mode === 'exhale') {
    scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * (1 - Math.min(1, progress))
  }

  const orbStyle: CSSProperties = {
    transform: `scale(${scale.toFixed(3)})`,
    transition: 'transform 0.15s linear',
  }

  const remainingWhole = Math.ceil(secondsRemaining)
  const displaySeconds = remainingWhole > 0 ? remainingWhole : 0
  const phaseLabel =
    mode === 'inhale' ? 'Inhale' : mode === 'exhale' ? 'Exhale' : 'Hold'

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-white/40 via-white/20 to-transparent text-sanctuary-base shadow-glow"
        style={orbStyle}
      >
        <span className="text-5xl font-semibold text-white">
          {displaySeconds}
        </span>
      </div>
      <span className="text-sm uppercase tracking-[0.4em] text-white/50">
        {phaseLabel} {totalSeconds ? `- ${totalSeconds}s` : ''}
      </span>
    </div>
  )
}
