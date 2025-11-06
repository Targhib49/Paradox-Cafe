import type { 
  SpecialShip, 
  SpecialShipType, 
  Position, 
  Board,
  Player 
} from './types'
import { canPlaceShip, placeShip } from './shipUtils'
import { v4 as uuidv4 } from 'uuid'

// ============================================
// CREATE SPECIAL SHIP
// ============================================

export function createSpecialShip(
  specialType: SpecialShipType,
  length: number,
  position: Position,
  orientation: 'horizontal' | 'vertical',
  boardOwner: Player
): SpecialShip {
  return {
    id: uuidv4(),
    type: specialType as any, // Cast to ShipType for compatibility
    specialType,
    length,
    position,
    orientation,
    hits: 0,
    sunk: false,
    boardOwner
  }
}

// ============================================
// PLACE SPECIAL SHIP ON BOARD
// ============================================

export function placeSpecialShip(
  board: Board,
  specialShip: SpecialShip
): void {
  // Use regular ship placement logic
  placeShip(board, specialShip)
  
  // Mark cells as special ships
  const { position, length, orientation } = specialShip
  
  if (orientation === 'horizontal') {
    for (let i = 0; i < length; i++) {
      const cell = board[position.row][position.col + i]
      // Add special ship marker (we'll use this in UI)
      cell.shipId = specialShip.id
    }
  } else {
    for (let i = 0; i < length; i++) {
      const cell = board[position.row + i][position.col]
      cell.shipId = specialShip.id
    }
  }
}

// ============================================
// CHECK WIN CONDITION (all special ships sunk)
// ============================================

export function allSpecialShipsSunk(specialShips: SpecialShip[]): boolean {
  return specialShips.length > 0 && specialShips.every(ship => ship.sunk)
}

// ============================================
// GET SPECIAL SHIPS BY BOARD
// ============================================

export function getSpecialShipsByBoard(
  specialShips: SpecialShip[],
  boardOwner: Player
): SpecialShip[] {
  return specialShips.filter(ship => ship.boardOwner === boardOwner)
}

// ============================================
// GET UNSUNK SPECIAL SHIPS
// ============================================

export function getUnsunkSpecialShips(specialShips: SpecialShip[]): SpecialShip[] {
  return specialShips.filter(ship => !ship.sunk)
}