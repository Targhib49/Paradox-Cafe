import type {
  Board,
  Position,
  Player,
  AttackResult2v2,
  BombTrap,
  SpecialShip,
  Ship
} from './types'
import { processAttack, isValidAttack } from './attackUtils'
import { checkTrapBeforeAttack } from './trapUtils2v2'
import { getShipById } from './shipUtils'

// ============================================
// PROCESS 2v2 ATTACK (with trap checking)
// ============================================

export function processAttack2v2(
  targetBoard: Board,
  targetShips: Ship[],
  targetSpecialShips: SpecialShip[],
  targetTraps: BombTrap[],
  targetBoardOwner: Player,  // CHANGED: Accept any Player type
  attackPosition: Position,
  attacker: Player  // CHANGED: Accept any Player type
): AttackResult2v2 {
  // First check for traps
  const trapCheck = checkTrapBeforeAttack(
    targetTraps,
    attackPosition,
    targetBoardOwner,
    targetBoard
  )
  
  if (trapCheck.trapFound) {
    // Trap triggered! Return trap result
    return {
      hit: false,
      shipSunk: false,
      position: attackPosition,
      trapTriggered: true,
      revealedCells: trapCheck.revealedCells
    }
  }
  
  // No trap - proceed with normal attack
  const allShips = [...targetShips, ...targetSpecialShips]
  const result = processAttack(targetBoard, allShips, attackPosition)
  
  // Check if hit ship was a special ship
  let isSpecialShip = false
  if (result.shipId) {
    isSpecialShip = targetSpecialShips.some(s => s.id === result.shipId)
  }
  
  return {
    ...result,
    trapTriggered: false,
    // Add special ship indicator if needed
  }
}

// ============================================
// VALIDATE 2v2 ATTACK
// ============================================

export function isValidAttack2v2(
  board: Board,
  position: Position,
  attacker: Player,  // CHANGED: Accept any Player type
  targetBoardOwner: Player  // CHANGED: Accept any Player type
): boolean {
  // Can't attack your own team's boards
  const attackerTeam = (attacker === 'user' || attacker === 'buddy') ? 'allies' : 'enemies'
  const targetTeam = (targetBoardOwner === 'user' || targetBoardOwner === 'buddy') ? 'allies' : 'enemies'
  
  // Cannot attack same team
  if (attackerTeam === targetTeam) {
    return false
  }
  
  // Use regular validation for cell state
  return isValidAttack(board, position)
}

// ============================================
// SIMULTANEOUS TEAM ATTACKS
// ============================================

export interface TeamAttackPlan {
  userAttack?: { target: Player; position: Position }
  buddyAttack?: { target: Player; position: Position }
}

export interface TeamAttackResults {
  userResult?: AttackResult2v2
  buddyResult?: AttackResult2v2
  skippedPlayers: Player[] // Who needs to skip next turn
}

// This will be used to execute both ally attacks at once