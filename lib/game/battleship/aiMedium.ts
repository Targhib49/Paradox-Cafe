import type { Board, Position } from './types'
import { getUntargetedCells, getAdjacentUntargetedCells, getHitPositions } from './boardUtils'

/**
 * Medium AI - Hunt/Target Mode
 * Win rate: ~45-55% against average players
 */
export function getMediumAIMove(board: Board): Position {
  // Get all unsunk hits (cells that were hit but ship not sunk yet)
  const hits = getUnsunkHits(board)
  
  // TARGET MODE: If we have unsunk hits, attack adjacent cells
  if (hits.length > 0) {
    const targetCells = getAdjacentUntargetedCells(board, hits)
    
    if (targetCells.length > 0) {
      // If multiple hits form a line, prioritize continuing that line
      if (hits.length >= 2) {
        const alignedTargets = getAlignedTargets(hits, targetCells)
        if (alignedTargets.length > 0) {
          return {
            row: alignedTargets[0].row,
            col: alignedTargets[0].col
          }
        }
      }
      
      // Otherwise, attack any adjacent cell
      const randomTarget = targetCells[Math.floor(Math.random() * targetCells.length)]
      return {
        row: randomTarget.row,
        col: randomTarget.col
      }
    }
  }
  
  // HUNT MODE: Use checkerboard pattern for efficiency
  const checkerboardCells = getCheckerboardCells(board)
  
  if (checkerboardCells.length > 0) {
    const randomCell = checkerboardCells[Math.floor(Math.random() * checkerboardCells.length)]
    return {
      row: randomCell.row,
      col: randomCell.col
    }
  }
  
  // Fallback: Random
  const untargeted = getUntargetedCells(board)
  if (untargeted.length === 0) {
    throw new Error('No valid moves available')
  }
  
  const randomCell = untargeted[Math.floor(Math.random() * untargeted.length)]
  return {
    row: randomCell.row,
    col: randomCell.col
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getUnsunkHits(board: Board): Position[] {
  const hits: Position[] = []
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = board[row][col]
      // Hit but not sunk
      if (cell.state === 'hit') {
        hits.push({ row, col })
      }
    }
  }
  
  return hits
}

function getAlignedTargets(
  hits: Position[],
  targetCells: { row: number; col: number }[]
): Position[] {
  if (hits.length < 2) return []
  
  // Check if hits are horizontal
  const sameRow = hits.every(h => h.row === hits[0].row)
  if (sameRow) {
    const row = hits[0].row
    // Return targets in same row
    return targetCells.filter(c => c.row === row)
  }
  
  // Check if hits are vertical
  const sameCol = hits.every(h => h.col === hits[0].col)
  if (sameCol) {
    const col = hits[0].col
    // Return targets in same column
    return targetCells.filter(c => c.col === col)
  }
  
  return []
}

function getCheckerboardCells(board: Board): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = []
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = board[row][col]
      
      // Checkerboard pattern: (row + col) % 2 === 0
      // Only target untargeted checkerboard cells
      if ((row + col) % 2 === 0) {
        if (cell.state === 'empty' || cell.state === 'ship') {
          cells.push({ row, col })
        }
      }
    }
  }
  
  return cells
}