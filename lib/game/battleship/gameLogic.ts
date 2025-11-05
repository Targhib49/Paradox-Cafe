import type { GameState, GameStats, Ship } from './types'
import { allShipsSunk } from './shipUtils'

// ============================================
// WIN CONDITION
// ============================================

export function checkWinCondition(state: GameState): 'user' | 'ai' | null {
  if (allShipsSunk(state.aiShips)) {
    return 'user'
  }
  
  if (allShipsSunk(state.userShips)) {
    return 'ai'
  }
  
  return null
}

// ============================================
// GAME STATS
// ============================================

export function calculateGameStats(state: GameState): GameStats {
  const { moves, startedAt, endedAt, userShips, aiShips } = state
  
  const userMoves = moves.filter(m => m.actor === 'user')
  const aiMoves = moves.filter(m => m.actor === 'ai')
  
  const userHits = userMoves.filter(m => m.result === 'hit' || m.result === 'sunk').length
  const userMisses = userMoves.filter(m => m.result === 'miss').length
  
  const aiHits = aiMoves.filter(m => m.result === 'hit' || m.result === 'sunk').length
  const aiMisses = aiMoves.filter(m => m.result === 'miss').length
  
  const duration = startedAt && endedAt 
    ? Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000)
    : 0
  
  return {
    duration,
    totalMoves: moves.length,
    userHits,
    userMisses,
    userAccuracy: userMoves.length > 0 ? (userHits / userMoves.length) * 100 : 0,
    aiHits,
    aiMisses,
    aiAccuracy: aiMoves.length > 0 ? (aiHits / aiMoves.length) * 100 : 0,
    userShipsSunk: aiShips.filter(s => s.sunk).length,
    aiShipsSunk: userShips.filter(s => s.sunk).length
  }
}

// ============================================
// TURN MANAGEMENT
// ============================================

export function getNextTurn(currentTurn: 'user' | 'ai'): 'user' | 'ai' {
  return currentTurn === 'user' ? 'ai' : 'user'
}