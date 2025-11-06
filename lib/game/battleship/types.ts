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

// ============================================
// 2v2 GAME MODE TYPES
// ============================================

export type GameMode = '1v1' | '2v2'

export type Player = 'user' | 'buddy' | 'enemy1' | 'enemy2'

export type Team = 'allies' | 'enemies'

// Special ships (win conditions for 2v2)
export type SpecialShipType = 'commander' | 'mother' | 'scout'

export interface SpecialShip extends Ship {
  specialType: SpecialShipType
  boardOwner: Player // Which board this ship is on
}

export const SPECIAL_SHIP_CONFIGS: { type: SpecialShipType; length: number; name: string }[] = [
  { type: 'commander', length: 5, name: 'Commander Ship' },
  { type: 'mother', length: 4, name: 'Mother Ship' },
  { type: 'scout', length: 3, name: 'Scout Ship' },
]

// Bomb traps (defensive mechanism)
export interface BombTrap {
  id: string
  boardOwner: Player // Which board this trap is on
  position: Position
  triggered: boolean
  revealRadius: number // Default: 1 (3x3 area)
}

// Team structure for 2v2
export interface TeamData {
  regularShips: Ship[] // 10 total (5 per player)
  specialShips: SpecialShip[] // 3 total (can be on any allied board)
  bombTraps: BombTrap[] // 3 total (can be on any allied board)
}

// Extended game state for 2v2
export interface GameState2v2 {
  mode: '2v2'
  phase: GamePhase
  turn: Turn
  
  // 4 boards
  userBoard: Board
  buddyBoard: Board
  enemy1Board: Board
  enemy2Board: Board
  
  // Team data
  alliesTeam: TeamData
  enemiesTeam: TeamData
  
  // Current turn (both teammates move simultaneously)
  turnPhase: 'allies' | 'enemies'
  
  // Turn skip tracking (for bomb traps)
  skippedPlayers: Player[]
  
  // Buddy AI personality
  buddyPersona: 'max' | 'rhea' | 'kai' | null
  
  // Game history and state
  moves: Move[]
  winner: 'user' | 'ai' | null
  startedAt: Date | null
  endedAt: Date | null
}

// Attack target for 2v2
export interface Attack2v2 {
  attacker: Player
  targetBoard: Player
  position: Position
}

// Attack result with trap info
export interface AttackResult2v2 extends AttackResult {
  trapTriggered: boolean
  revealedCells?: Position[] // If trap triggered, cells revealed
}

// Win condition for 2v2
export interface WinCondition2v2 {
  team: Team
  specialShipsSunk: number // Must sink all 3
  remainingSpecialShips: SpecialShip[]
}