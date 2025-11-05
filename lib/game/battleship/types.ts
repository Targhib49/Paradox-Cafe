// ============================================
// CELL & BOARD TYPES
// ============================================

export type CellState = 
  | 'empty'      // Water, not attacked
  | 'miss'       // Attacked water
  | 'ship'       // Ship present, not hit
  | 'hit'        // Ship hit
  | 'sunk'       // Ship sunk
  | 'unknown'    // Enemy board fog of war

export interface Cell {
  row: number              // 0-9
  col: number              // 0-9
  state: CellState
  shipId?: string          // Which ship occupies this cell
  shipPartIndex?: number   // Which part of the ship (0-4 for carrier)
}

export type Board = Cell[][] // 10x10 grid

// ============================================
// SHIP TYPES
// ============================================

export type ShipType = 
  | 'carrier'     // 5 cells
  | 'battleship'  // 4 cells
  | 'cruiser'     // 3 cells
  | 'submarine'   // 3 cells
  | 'destroyer'   // 2 cells

export interface ShipConfig {
  type: ShipType
  length: number
  name: string
}

export const SHIP_CONFIGS: ShipConfig[] = [
  { type: 'carrier', length: 5, name: 'Carrier' },
  { type: 'battleship', length: 4, name: 'Battleship' },
  { type: 'cruiser', length: 3, name: 'Cruiser' },
  { type: 'submarine', length: 3, name: 'Submarine' },
  { type: 'destroyer', length: 2, name: 'Destroyer' },
]

export interface Ship {
  id: string                      // Unique identifier
  type: ShipType
  length: number
  position: Position
  orientation: 'horizontal' | 'vertical'
  hits: number                    // Number of times hit (0 to length)
  sunk: boolean
}

export interface Position {
  row: number     // 0-9
  col: number     // 0-9
}

// ============================================
// GAME STATE TYPES
// ============================================

export type GamePhase = 
  | 'placement'   // User placing ships
  | 'playing'     // Active gameplay
  | 'game-over'   // Game finished

export type Turn = 'user' | 'ai'

export interface GameState {
  phase: GamePhase
  turn: Turn
  
  // Boards
  userBoard: Board
  aiBoard: Board
  
  // Ships
  userShips: Ship[]
  aiShips: Ship[]
  
  // Game history
  moves: Move[]
  
  // Game result
  winner: 'user' | 'ai' | null
  
  // Metadata
  startedAt: Date | null
  endedAt: Date | null
}

export interface Move {
  actor: 'user' | 'ai'
  target: Position
  result: 'hit' | 'miss' | 'sunk'
  shipSunk?: ShipType  // If ship was sunk
  turnNumber: number
  timestamp: Date
}

// ============================================
// GAME STATS
// ============================================

export interface GameStats {
  duration: number          // seconds
  totalMoves: number
  userHits: number
  userMisses: number
  userAccuracy: number      // percentage
  aiHits: number
  aiMisses: number
  aiAccuracy: number
  userShipsSunk: number
  aiShipsSunk: number
}

// ============================================
// AI TYPES
// ============================================

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface AIMove {
  row: number
  col: number
  reasoning?: string  // For display/debugging
}

// ============================================
// ATTACK RESULT
// ============================================

export interface AttackResult {
  hit: boolean
  shipId?: string
  shipType?: ShipType
  shipSunk: boolean
  position: Position
}