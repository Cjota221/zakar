export function getDailyPsalmNumber(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
  return (dayOfYear % 150) + 1
}

export function getDailyProverbChapter(): number {
  const day = new Date().getDate()
  return day <= 31 ? day : 31
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}
