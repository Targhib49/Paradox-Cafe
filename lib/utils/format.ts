import { formatDistanceToNow, format as formatDate } from 'date-fns'

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/**
 * Format a date as readable string
 */
export function formatDateString(date: string | Date, formatStr: string = 'PPP'): string {
  return formatDate(new Date(date), formatStr)
}

/**
 * Format playtime in seconds to human-readable format
 */
export function formatPlaytime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours === 0 && minutes === 0) return 'Less than a minute'
  if (hours === 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
  if (minutes === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  
  return `${hours}h ${minutes}m`
}

/**
 * Format win rate percentage
 */
export function formatWinRate(wins: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((wins / total) * 100)}%`
}

/**
 * Format affinity score to relationship description
 */
export function formatAffinityDescription(affinity: number): string {
  if (affinity >= 90) return 'Inseparable'
  if (affinity >= 70) return 'Close Friends'
  if (affinity >= 50) return 'Friendly'
  if (affinity >= 30) return 'Neutral'
  if (affinity >= 10) return 'Tense'
  return 'Rivals'
}

/**
 * Format large numbers with K, M suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}