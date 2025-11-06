import type { Board, Position, Cell } from './types'
import { isValidCell } from './boardUtils'

// ============================================
// 3x3 REVEAL AREA (for bomb traps)
// ============================================

export function get3x3Area(center: Position): Position[] {
  const positions: Position[] = []
  
  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      const row = center.row + dRow
      const col = center.col + dCol
      
      if (isValidCell(row, col)) {
        positions.push({ row, col })
      }
    }
  }
  
  return positions
}

// ============================================
// REVEAL CELLS (make visible to enemy)
// ============================================

export function revealCells(board: Board, positions: Position[]): void {
  for (const pos of positions) {
    const cell = board[pos.row][pos.col]
    
    // Mark cell as revealed
    if (cell.state === 'empty') {
      // Empty cells become known water
      cell.state = 'miss' // Or we could add a 'revealed' state
    }
    // Ships become visible but not hit
    if (cell.state === 'ship') {
      // Ship is now visible to enemy (but not damaged)
      // We'll handle this in UI - show ship outline
    }
  }
}

// ============================================
// CHECK IF POSITION HAS TRAP
// ============================================

export function hasTrapAt(
  traps: import('./types').BombTrap[],
  position: Position,
  boardOwner: import('./types').Player
): import('./types').BombTrap | null {
  const trap = traps.find(
    t => 
      t.boardOwner === boardOwner &&
      t.position.row === position.row &&
      t.position.col === position.col &&
      !t.triggered
  )
  
  return trap || null
}

// ============================================
// CHECK TRAP PLACEMENT VALIDITY
// ============================================

export function canPlaceTrap(
  board: Board,
  position: Position,
  existingTraps: import('./types').BombTrap[],
  boardOwner: import('./types').Player
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