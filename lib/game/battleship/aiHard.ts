import type { Board, Position, Ship } from './types'
import { getUntargetedCells, isValidCell } from './boardUtils'
import { SHIP_CONFIGS } from './types'

/**
 * Hard AI - Probability Heat Map
 * Win rate: ~65-75% against experienced players
 */
export function getHardAIMove(board: Board, remainingShips: Ship[]): Position {
  // Check for unsunk hits first (finish what we started)
  const unsunkHits = getUnsunkHits(board)
  
  if (unsunkHits.length > 0) {
    return getOptimalFinishingMove(board, unsunkHits)
  }
  
  // Calculate probability heat map
  const heatMap = calculateHeatMap(board, remainingShips)
  
  // Find cell with highest probability
  const bestCell = getHighestProbabilityCell(heatMap, board)
  
  return bestCell
}

// ============================================
// HEAT MAP CALCULATION
// ============================================

function calculateHeatMap(board: Board, remainingShips: Ship[]): number[][] {
  const heatMap = Array(10).fill(0).map(() => Array(10).fill(0))
  
  // Get ship lengths we're still looking for
  const shipLengths = remainingShips
    .filter(s => !s.sunk)
    .map(s => s.length)
  
  // If no specific ships, use all possible lengths
  const lengths = shipLengths.length > 0 
    ? shipLengths 
    : SHIP_CONFIGS.map(c => c.length)
  
  // For each ship length
  for (const length of lengths) {
    // Try all possible placements
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        // Try horizontal
        if (canPlaceShipForAI(board, row, col, length, 'horizontal')) {
          for (let i = 0; i < length; i++) {
            heatMap[row][col + i]++
          }
        }
        
        // Try vertical
        if (canPlaceShipForAI(board, row, col, length, 'vertical')) {
          for (let i = 0; i < length; i++) {
            heatMap[row + i][col]++
          }
        }
      }
    }
  }
  
  return heatMap
}

function canPlaceShipForAI(
  board: Board,
  row: number,
  col: number,
  length: number,
  orientation: 'horizontal' | 'vertical'
): boolean {
  if (orientation === 'horizontal') {
    if (col + length > 10) return false
    
    for (let i = 0; i < length; i++) {
      const cell = board[row][col + i]
      // Can't place if we already know it's a miss or sunk
      if (cell.state === 'miss' || cell.state === 'sunk') {
        return false
      }
    }
  } else {
    if (row + length > 10) return false
    
    for (let i = 0; i < length; i++) {
      const cell = board[row + i][col]
      if (cell.state === 'miss' || cell.state === 'sunk') {
        return false
      }
    }
  }
  
  return true
}

function getHighestProbabilityCell(heatMap: number[][], board: Board): Position {
  let maxProb = -1
  let bestCells: Position[] = []
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = board[row][col]
      
      // Only consider untargeted cells
      if (cell.state === 'empty' || cell.state === 'ship') {
        const prob = heatMap[row][col]
        
        if (prob > maxProb) {
          maxProb = prob
          bestCells = [{ row, col }]
        } else if (prob === maxProb) {
          bestCells.push({ row, col })
        }
      }
    }
  }
  
  if (bestCells.length === 0) {
    // Fallback
    const untargeted = getUntargetedCells(board)
    return untargeted[Math.floor(Math.random() * untargeted.length)]
  }
  
  // Pick random from best cells
  return bestCells[Math.floor(Math.random() * bestCells.length)]
}

// ============================================
// FINISHING MOVES
// ============================================

function getUnsunkHits(board: Board): Position[] {
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

function getOptimalFinishingMove(board: Board, hits: Position[]): Position {
  // Get all adjacent untargeted cells
  const adjacentCells: Position[] = []
  
  for (const hit of hits) {
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ]
    
    for (const [dRow, dCol] of directions) {
      const row = hit.row + dRow
      const col = hit.col + dCol
      
      if (isValidCell(row, col)) {
        const cell = board[row][col]
        if (cell.state === 'empty' || cell.state === 'ship') {
          adjacentCells.push({ row, col })
        }
      }
    }
  }
  
  if (adjacentCells.length === 0) {
    // Shouldn't happen, but fallback
    const untargeted = getUntargetedCells(board)
    return untargeted[Math.floor(Math.random() * untargeted.length)]
  }
  
  // If multiple hits form a line, continue in that direction
  if (hits.length >= 2) {
    const aligned = getAlignedCells(hits, adjacentCells)
    if (aligned.length > 0) {
      return aligned[0]
    }
  }
  
  // Otherwise pick random adjacent
  return adjacentCells[Math.floor(Math.random() * adjacentCells.length)]
}

function getAlignedCells(hits: Position[], candidates: Position[]): Position[] {
  // Check if horizontal
  const sameRow = hits.every(h => h.row === hits[0].row)
  if (sameRow) {
    return candidates.filter(c => c.row === hits[0].row)
  }
  
  // Check if vertical
  const sameCol = hits.every(h => h.col === hits[0].col)
  if (sameCol) {
    return candidates.filter(c => c.col === hits[0].col)
  }
  
  return []
}