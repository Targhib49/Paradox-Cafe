import type { RelationshipType } from '@/lib/types'

/**
 * Determine relationship type based on affinity score
 */
export function getRelationshipType(affinity: number): RelationshipType {
  if (affinity >= 70) return 'buddy'
  if (affinity <= 30) return 'rival'
  return 'neutral'
}

/**
 * Get relationship color for UI
 */
export function getRelationshipColor(relationshipType: RelationshipType): string {
  switch (relationshipType) {
    case 'buddy':
      return 'text-green-400'
    case 'rival':
      return 'text-red-400'
    default:
      return 'text-gray-400'
  }
}

/**
 * Get relationship emoji
 */
export function getRelationshipEmoji(relationshipType: RelationshipType): string {
  switch (relationshipType) {
    case 'buddy':
      return '🤝'
    case 'rival':
      return '⚔️'
    default:
      return '🎮'
  }
}

/**
 * Calculate affinity change after game
 */
export function calculateAffinityChange(
  won: boolean,
  wasCloseGame: boolean
): number {
  let delta = 0
  
  if (won) {
    delta = 3 // Base win bonus
    if (wasCloseGame) delta += 2 // Close win creates stronger bond
  } else {
    delta = -1 // Small penalty for loss
    if (wasCloseGame) delta += 1 // Close loss = learned something
  }
  
  return delta
}

/**
 * Clamp affinity between 0 and 100
 */
export function clampAffinity(affinity: number): number {
  return Math.max(0, Math.min(100, affinity))
}