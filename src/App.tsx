import { useCallback, useState } from 'react'
import { RelaxedPauseCalibration } from './components/RelaxedPauseCalibration'
import { Sanctuary } from './components/Sanctuary'
import { TrainingSession } from './components/TrainingSession'
import { useStoredState } from './hooks/useStoredState'
import { toIsoDate } from './utils/date'

type View = 'sanctuary' | 'calibration' | 'session'

const STORAGE_KEYS = {
  rp: 'reinspire.rpSeconds',
  lastCalibration: 'reinspire.lastCalibrationDate',
  streak: 'reinspire.streak',
  lastSession: 'reinspire.lastSessionDate',
} as const

function App() {
  const [view, setView] = useState<View>('sanctuary')
  const [rpSeconds, setRpSeconds] = useStoredState<number | null>(STORAGE_KEYS.rp, null)
  const [lastCalibrationDate, setLastCalibrationDate] = useStoredState<string | null>(
    STORAGE_KEYS.lastCalibration,
    null,
  )
  const [streak, setStreak] = useStoredState<number>(STORAGE_KEYS.streak, 0)
  const [, setLastSessionDate] = useStoredState<string | null>(STORAGE_KEYS.lastSession, null)

  const handleSaveRelaxedPause = useCallback(
    (seconds: number) => {
      setRpSeconds(seconds)
      setLastCalibrationDate(toIsoDate(new Date()))
      setView('sanctuary')
    },
    [setLastCalibrationDate, setRpSeconds],
  )

  const handleStartSession = useCallback(() => {
    if (rpSeconds == null) return
    setView('session')
  }, [rpSeconds])

  const handleSessionComplete = useCallback(() => {
    setStreak((current) => current + 1)
    setLastSessionDate(toIsoDate(new Date()))
  }, [setLastSessionDate, setStreak])

  const handleSessionExit = useCallback(() => {
    setView('sanctuary')
  }, [])

  if (view === 'calibration') {
    return (
      <RelaxedPauseCalibration
        onBack={handleSessionExit}
        onSave={handleSaveRelaxedPause}
      />
    )
  }

  if (view === 'session' && rpSeconds != null) {
    return (
      <TrainingSession
        rpSeconds={rpSeconds}
        onBack={handleSessionExit}
        onCancel={handleSessionExit}
        onComplete={handleSessionComplete}
      />
    )
  }

  return (
    <Sanctuary
      rpSeconds={rpSeconds}
      streak={streak}
      lastCalibrationDate={lastCalibrationDate}
      onStartSession={handleStartSession}
      onCalibrate={() => setView('calibration')}
    />
  )
}

export default App