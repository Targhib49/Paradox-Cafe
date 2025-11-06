import type { BombTrap, Position, Board, Player, AttackResult2v2 } from './types'
import { get3x3Area, hasTrapAt } from './boardUtils2v2'
import { isValidCell } from './boardUtils'
import { v4 as uuidv4 } from 'uuid'

// ============================================
// CREATE BOMB TRAP
// ============================================

export function createBombTrap(
  position: Position,
  boardOwner: Player
): BombTrap {
  return {
    id: uuidv4(),
    boardOwner,
    position,
    triggered: false,
    revealRadius: 1 // 3x3 area
  }
}

// ============================================
// TRIGGER TRAP
// ============================================

export function triggerTrap(
  trap: BombTrap,
  board: Board,
  attacker: Player
): {
  revealedCells: Position[]
  skipNextTurn: boolean
} {
  // Mark trap as triggered
  trap.triggered = true
  
  // Get 3x3 area around trap
  const revealedCells = get3x3Area(trap.position)
  
  // Note: Revealing cells to attacker will be handled in UI
  // The board state itself doesn't change for reveals
  
  return {
    revealedCells,
    skipNextTurn: true // Attacker skips next turn
  }
}

// ============================================
// CHECK FOR TRAP BEFORE ATTACK
// ============================================

export function checkTrapBeforeAttack(
  traps: BombTrap[],
  targetPosition: Position,
  targetBoardOwner: Player,
  attackerBoard: Board
): {
  trapFound: boolean
  trap?: BombTrap
  revealedCells?: Position[]
} {
  const trap = hasTrapAt(traps, targetPosition, targetBoardOwner)
  
  if (!trap) {
    return { trapFound: false }
  }
  
  // Trigger trap
  const result = triggerTrap(trap, attackerBoard, targetBoardOwner)
  
  return {
    trapFound: true,
    trap,
    revealedCells: result.revealedCells
  }
}

// ============================================
// CHECK TRAP PLACEMENT VALIDITY
// ============================================

export function canPlaceTrap(
  board: Board,
  position: Position,
  existingTraps: BombTrap[],
  boardOwner: Player
): boolean {
  // Check if position is valid
  if (!isValidCell(position.row, position.col)) return false
  
  // Check if trap already exists at this position
  const existingTrap = hasTrapAt(existingTraps, position, boardOwner)
  if (existingTrap) return false
  
  // Traps can be placed on empty cells or near ships
  const cell = board[position.row][position.col]
  return cell.state === 'empty' || cell.state === 'ship'
}

// ============================================
// GET TRAPS BY BOARD
// ============================================

export function getTrapsByBoard(
  traps: BombTrap[],
  boardOwner: Player
): BombTrap[] {
  return traps.filter(trap => trap.boardOwner === boardOwner)
}

// ============================================
// COUNT ACTIVE TRAPS
// ============================================

export function countActiveTraps(traps: BombTrap[]): number {
  return traps.filter(trap => !trap.triggered).length
}