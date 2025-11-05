import type { Board, Ship, Position, AttackResult } from './types'
import { getCell } from './boardUtils'
import { getShipById } from './shipUtils'

// ============================================
// ATTACK PROCESSING
// ============================================

export function processAttack(
  board: Board,
  ships: Ship[],
  position: Position
): AttackResult {
  const { row, col } = position
  const cell = getCell(board, row, col)
  
  if (!cell) {
    throw new Error(`Invalid attack position: ${row}, ${col}`)
  }
  
  // Check if already attacked
  if (cell.state === 'hit' || cell.state === 'miss' || cell.state === 'sunk') {
    throw new Error(`Cell already attacked: ${row}, ${col}`)
  }
  
  // Check if hit or miss
  if (cell.shipId) {
    // HIT!
    cell.state = 'hit'
    
    const ship = getShipById(ships, cell.shipId)
    if (!ship) {
      throw new Error(`Ship not found: ${cell.shipId}`)
    }
    
    // Increment ship hits
    ship.hits++
    
    // Check if ship is sunk
    const shipSunk = ship.hits >= ship.length
    if (shipSunk) {
      ship.sunk = true
      markShipAsSunk(board, ship.id)
    }
    
    return {
      hit: true,
      shipId: ship.id,
      shipType: ship.type,
      shipSunk,
      position
    }
  } else {
    // MISS
    cell.state = 'miss'
    
    return {
      hit: false,
      shipSunk: false,
      position
    }
  }
}

// ============================================
// MARK SHIP AS SUNK
// ============================================

function markShipAsSunk(board: Board, shipId: string): void {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = board[row][col]
      if (cell.shipId === shipId) {
        cell.state = 'sunk'
      }
    }
  }
}

// ============================================
// CHECK VALID ATTACK
// ============================================

export function isValidAttack(board: Board, position: Position): boolean {
  const cell = getCell(board, position.row, position.col)
  if (!cell) return false
  
  // Can only attack empty, ship, or unknown cells
  return cell.state === 'empty' || cell.state === 'ship' || cell.state === 'unknown'
}

// ============================================
// GET HIT POSITIONS
// ============================================

export function getHitPositions(board: Board): Position[] {
  const hits: Position[] = []
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (board[row][col].state === 'hit') {
        hits.push({ row, col })
      }
    }
  }
  
  return hits
}