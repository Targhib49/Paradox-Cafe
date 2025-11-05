import type { Board, Ship, Position, ShipType, ShipConfig } from './types'
import { isValidCell, getCell, createEmptyBoard } from './boardUtils'
import { v4 as uuidv4 } from 'uuid'

// ============================================
// SHIP PLACEMENT VALIDATION
// ============================================

export function canPlaceShip(
  board: Board,
  position: Position,
  length: number,
  orientation: 'horizontal' | 'vertical'
): boolean {
  const { row, col } = position
  
  // Check if ship fits within bounds
  if (orientation === 'horizontal') {
    if (col + length > 10) return false
    
    // Check if all cells are empty
    for (let i = 0; i < length; i++) {
      const cell = board[row][col + i]
      if (cell.state !== 'empty') return false
    }
  } else {
    if (row + length > 10) return false
    
    // Check if all cells are empty
    for (let i = 0; i < length; i++) {
      const cell = board[row + i][col]
      if (cell.state !== 'empty') return false
    }
  }
  
  return true
}

// ============================================
// SHIP PLACEMENT
// ============================================

export function placeShip(
  board: Board,
  ship: Ship
): Board {
  const { position, length, orientation, id } = ship
  const { row, col } = position
  
  // Place ship on board
  if (orientation === 'horizontal') {
    for (let i = 0; i < length; i++) {
      board[row][col + i].state = 'ship'
      board[row][col + i].shipId = id
      board[row][col + i].shipPartIndex = i
    }
  } else {
    for (let i = 0; i < length; i++) {
      board[row + i][col].state = 'ship'
      board[row + i][col].shipId = id
      board[row + i][col].shipPartIndex = i
    }
  }
  
  return board
}

// ============================================
// SHIP CREATION
// ============================================

export function createShip(
  type: ShipType,
  length: number,
  position: Position,
  orientation: 'horizontal' | 'vertical'
): Ship {
  return {
    id: uuidv4(),
    type,
    length,
    position,
    orientation,
    hits: 0,
    sunk: false
  }
}

// ============================================
// RANDOM SHIP PLACEMENT (for AI)
// ============================================

export function placeShipsRandomly(
  board: Board,
  shipConfigs: ShipConfig[]
): Ship[] {
  const ships: Ship[] = []
  
  for (const config of shipConfigs) {
    let placed = false
    let attempts = 0
    
    while (!placed && attempts < 100) {
      const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical'
      const row = Math.floor(Math.random() * 10)
      const col = Math.floor(Math.random() * 10)
      const position = { row, col }
      
      if (canPlaceShip(board, position, config.length, orientation)) {
        const ship = createShip(config.type, config.length, position, orientation)
        placeShip(board, ship)
        ships.push(ship)
        placed = true
      }
      
      attempts++
    }
    
    if (!placed) {
      throw new Error(`Failed to place ${config.type} after 100 attempts`)
    }
  }
  
  return ships
}

// ============================================
// SHIP QUERIES
// ============================================

export function getShipById(ships: Ship[], shipId: string): Ship | undefined {
  return ships.find(ship => ship.id === shipId)
}

export function countSunkShips(ships: Ship[]): number {
  return ships.filter(ship => ship.sunk).length
}

export function allShipsSunk(ships: Ship[]): boolean {
  return ships.length > 0 && ships.every(ship => ship.sunk)
}

// ============================================
// SHIP POSITIONS
// ============================================

export function getShipCells(ship: Ship): Position[] {
  const cells: Position[] = []
  const { position, length, orientation } = ship
  
  if (orientation === 'horizontal') {
    for (let i = 0; i < length; i++) {
      cells.push({
        row: position.row,
        col: position.col + i
      })
    }
  } else {
    for (let i = 0; i < length; i++) {
      cells.push({
        row: position.row + i,
        col: position.col
      })
    }
  }
  
  return cells
}

// ============================================
// PLAYER RANDOM PLACEMENT (with retry safety)
// ============================================

export function placePlayerShipsRandomly(
  shipConfigs: ShipConfig[]
): { board: Board; ships: Ship[] } {
  // Create fresh board
  const board = createEmptyBoard()
  const ships: Ship[] = []
  
  for (const config of shipConfigs) {
    let placed = false
    let attempts = 0
    const maxAttempts = 100
    
    while (!placed && attempts < maxAttempts) {
      const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical'
      const row = Math.floor(Math.random() * 10)
      const col = Math.floor(Math.random() * 10)
      const position = { row, col }
      
      if (canPlaceShip(board, position, config.length, orientation)) {
        const ship = createShip(config.type, config.length, position, orientation)
        placeShip(board, ship)
        ships.push(ship)
        placed = true
      }
      
      attempts++
    }
    
    if (!placed) {
      // If we fail, start over with new board
      console.warn(`Failed to place ${config.type}, restarting placement...`)
      return placePlayerShipsRandomly(shipConfigs)
    }
  }
  
  return { board, ships }
}