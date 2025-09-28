export function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatSeconds(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds))
  const mins = Math.floor(safeSeconds / 60)
  const secs = safeSeconds % 60
  if (mins === 0) return `${secs}s`
  return `${mins}m ${secs.toString().padStart(2, '0')}s`
}

export function describeDateDifference(targetIso: string | null): string | null {
  if (!targetIso) return null
  const target = new Date(`${targetIso}T00:00:00`)
  if (Number.isNaN(target.getTime())) return null

  const todayIso = toIsoDate(new Date())
  if (todayIso === targetIso) return 'today'

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (toIsoDate(yesterday) === targetIso) return 'yesterday'

  return target.toLocaleDateString()
}

export function isYesterday(isoDate: string | null, todayIso: string): boolean {
  if (!isoDate) return false
  const yesterday = new Date(`${todayIso}T00:00:00`)
  yesterday.setDate(yesterday.getDate() - 1)
  return toIsoDate(yesterday) === isoDate
}