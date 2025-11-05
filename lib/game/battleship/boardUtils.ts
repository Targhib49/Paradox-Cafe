import type { Board, Cell, Position } from './types'

// ============================================
// BOARD CREATION
// ============================================

export function createEmptyBoard(): Board {
  const board: Board = []
  
  for (let row = 0; row < 10; row++) {
    board[row] = []
    for (let col = 0; col < 10; col++) {
      board[row][col] = {
        row,
        col,
        state: 'empty'
      }
    }
  }
  
  return board
}

// ============================================
// BOARD VALIDATION
// ============================================

export function isValidCell(row: number, col: number): boolean {
  return row >= 0 && row < 10 && col >= 0 && col < 10
}

export function isValidPosition(position: Position): boolean {
  return isValidCell(position.row, position.col)
}

// ============================================
// CELL QUERIES
// ============================================

export function getCell(board: Board, row: number, col: number): Cell | null {
  if (!isValidCell(row, col)) return null
  return board[row][col]
}

export function getCellsByState(board: Board, state: Cell['state']): Cell[] {
  const cells: Cell[] = []
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (board[row][col].state === state) {
        cells.push(board[row][col])
      }
    }
  }
  
  return cells
}

export function getUntargetedCells(board: Board): Cell[] {
  const cells: Cell[] = []
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = board[row][col]
      // Cell is untargeted if it's empty or has a ship (not hit/miss/sunk)
      if (cell.state === 'empty' || cell.state === 'ship' || cell.state === 'unknown') {
        cells.push(cell)
      }
    }
  }
  
  return cells
}

// ============================================
// ADJACENT CELLS
// ============================================

export function getAdjacentCells(
  board: Board,
  row: number,
  col: number
): Cell[] {
  const adjacent: Cell[] = []
  const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1],  // Right
  ]
  
  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow
    const newCol = col + dCol
    
    if (isValidCell(newRow, newCol)) {
      adjacent.push(board[newRow][newCol])
    }
  }
  
  return adjacent
}

export function getAdjacentUntargetedCells(
  board: Board,
  positions: Position[]
): Cell[] {
  const adjacentSet = new Set<string>()
  const result: Cell[] = []
  
  for (const pos of positions) {
    const adjacent = getAdjacentCells(board, pos.row, pos.col)
    
    for (const cell of adjacent) {
      const key = `${cell.row},${cell.col}`
      
      // Only add if untargeted and not already in set
      if (!adjacentSet.has(key)) {
        const isUntargeted = 
          cell.state === 'empty' || 
          cell.state === 'ship' || 
          cell.state === 'unknown'
        
        if (isUntargeted) {
          adjacentSet.add(key)
          result.push(cell)
        }
      }
    }
  }
  
  return result
}

// ============================================
// COORDINATE CONVERSION
// ============================================

export function rowToNumber(row: number): number {
  return row + 1 // 0 -> 1, 9 -> 10
}

export function colToLetter(col: number): string {
  return String.fromCharCode(65 + col) // 0 -> A, 9 -> J
}

export function positionToCoord(position: Position): string {
  return `${colToLetter(position.col)}${rowToNumber(position.row)}`
}

export function coordToPosition(coord: string): Position | null {
  // E.g., "E5" -> { row: 4, col: 4 }
  if (coord.length < 2) return null
  
  const colLetter = coord[0].toUpperCase()
  const rowNumber = parseInt(coord.substring(1))
  
  const col = colLetter.charCodeAt(0) - 65 // A -> 0
  const row = rowNumber - 1 // 1 -> 0
  
  if (!isValidCell(row, col)) return null
  
  return { row, col }
}

// ============================================
// BOARD COPYING (for immutability)
// ============================================

export function cloneBoard(board: Board): Board {
  return board.map(row => 
    row.map(cell => ({ ...cell }))
  )
}

// ============================================
// GET HIT POSITIONS (for AI)
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