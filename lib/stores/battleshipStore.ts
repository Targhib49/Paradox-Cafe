import { create } from 'zustand'
import type { 
  GameState, 
  Ship, 
  Position, 
  Board, 
  Move,
  Difficulty,
  GamePhase
} from '@/lib/game/battleship/types'
import { SHIP_CONFIGS } from '@/lib/game/battleship/types'
import { createEmptyBoard } from '@/lib/game/battleship/boardUtils'
import { 
  placeShip, 
  placeShipsRandomly,
  placePlayerShipsRandomly,
  createShip,
  canPlaceShip,
  getShipById
} from '@/lib/game/battleship/shipUtils'
import { processAttack, isValidAttack } from '@/lib/game/battleship/attackUtils'
import { checkWinCondition, calculateGameStats, getNextTurn } from '@/lib/game/battleship/gameLogic'
import { getEasyAIMove } from '@/lib/game/battleship/aiEasy'
import { getMediumAIMove } from '@/lib/game/battleship/aiMedium'
import { getHardAIMove } from '@/lib/game/battleship/aiHard'

// ============================================
// STORE INTERFACE
// ============================================

interface BattleshipStore {
  // State
  gameState: GameState
  difficulty: Difficulty
  
  // Setup Actions
  startNewGame: () => void
  randomizePlacement: () => void
  placeUserShip: (
    shipType: string, 
    position: Position, 
    orientation: 'horizontal' | 'vertical'
  ) => boolean
  confirmPlacement: () => void
  
  // Gameplay Actions
  userAttack: (position: Position) => void
  aiAttack: () => void
  
  // Utility
  setDifficulty: (difficulty: Difficulty) => void
  reset: () => void

  // Game controls
  isPaused: boolean
  pauseGame: () => void
  resumeGame: () => void
  surrender: () => void
}

// ============================================
// INITIAL STATE
// ============================================

const createInitialState = (): GameState => ({
  phase: 'placement',
  turn: 'user',
  userBoard: createEmptyBoard(),
  aiBoard: createEmptyBoard(),
  userShips: [],
  aiShips: [],
  moves: [],
  winner: null,
  startedAt: null,
  endedAt: null
})

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useBattleshipStore = create<BattleshipStore>((set, get) => ({
  gameState: createInitialState(),
  difficulty: 'medium',
  
  // ========================================
  // START NEW GAME
  // ========================================
  startNewGame: () => {
    set({ gameState: createInitialState() })
  },
  
  // ========================================
  // RANDOMIZE PLAYER PLACEMENT
  // ========================================
  randomizePlacement: () => {
    const { board, ships } = placePlayerShipsRandomly(SHIP_CONFIGS)
    
    set(state => ({
      gameState: {
        ...state.gameState,
        userBoard: board,
        userShips: ships
      }
    }))
  },
  
  // ========================================
  // PLACE USER SHIP (Manual)
  // ========================================
  placeUserShip: (shipType, position, orientation) => {
    const state = get().gameState
    
    // Find ship config
    const config = SHIP_CONFIGS.find(c => c.type === shipType)
    if (!config) return false
    
    // Check if ship already placed
    const alreadyPlaced = state.userShips.some(s => s.type === config.type)
    if (alreadyPlaced) return false
    
    // Validate placement
    if (!canPlaceShip(state.userBoard, position, config.length, orientation)) {
      return false
    }
    
    // Create and place ship
    const ship = createShip(config.type, config.length, position, orientation)
    const newBoard = [...state.userBoard.map(row => [...row])] // Clone
    placeShip(newBoard, ship)
    
    set(state => ({
      gameState: {
        ...state.gameState,
        userBoard: newBoard,
        userShips: [...state.gameState.userShips, ship]
      }
    }))
    
    return true
  },
  
  // ========================================
  // CONFIRM PLACEMENT & START GAME
  // ========================================
  confirmPlacement: () => {
    const state = get().gameState
    
    // Verify all 5 ships placed
    if (state.userShips.length !== 5) {
      console.error('Not all ships placed!')
      return
    }
    
    // Place AI ships
    const aiBoard = createEmptyBoard()
    const aiShips = placeShipsRandomly(aiBoard, SHIP_CONFIGS)
    
    set(state => ({
      gameState: {
        ...state.gameState,
        aiBoard,
        aiShips,
        phase: 'playing',
        startedAt: new Date()
      }
    }))
  },
  
  // ========================================
  // USER ATTACK
  // ========================================
  userAttack: (position) => {
    const state = get().gameState
    
    // Validate
    if (state.phase !== 'playing') return
    if (state.turn !== 'user') return
    if (!isValidAttack(state.aiBoard, position)) return
    
    // Process attack
    const result = processAttack(state.aiBoard, state.aiShips, position)
    
    // Record move
    const move: Move = {
      actor: 'user',
      target: position,
      result: result.shipSunk ? 'sunk' : (result.hit ? 'hit' : 'miss'),
      shipSunk: result.shipType,
      turnNumber: state.moves.length + 1,
      timestamp: new Date()
    }
    
    // Check win condition
    const winner = checkWinCondition({
      ...state,
      aiBoard: state.aiBoard,
      aiShips: state.aiShips,
      moves: [...state.moves, move]
    })
    
    // Update state
    set(prevState => ({
      gameState: {
        ...prevState.gameState,
        aiBoard: prevState.gameState.aiBoard, // Already mutated by processAttack
        moves: [...prevState.gameState.moves, move],
        turn: winner ? prevState.gameState.turn : 'ai',
        winner,
        phase: winner ? 'game-over' : 'playing',
        endedAt: winner ? new Date() : null
      }
    }))
    
    // Trigger AI attack after delay (if game not over)
    if (!winner) {
      setTimeout(() => {
        get().aiAttack()
      }, 1000) // 1 second delay
    }
  },
  
  // ========================================
  // AI ATTACK (with difficulty support)
  // ========================================
  aiAttack: () => {
    const state = get().gameState
    const difficulty = get().difficulty
    
    if (state.phase !== 'playing') return
    if (state.turn !== 'ai') return
    
    let position: Position
    
    // Select AI based on difficulty
    try {
      switch (difficulty) {
        case 'easy':
          position = getEasyAIMove(state.userBoard)
          break
        case 'medium':
          position = getMediumAIMove(state.userBoard)
          break
        case 'hard':
          position = getHardAIMove(state.userBoard, state.userShips)
          break
        default:
          position = getEasyAIMove(state.userBoard)
      }
    } catch (error) {
      console.error('AI move failed:', error)
      return
    }
    
    // Process attack
    const result = processAttack(state.userBoard, state.userShips, position)
    
    // Record move
    const move: Move = {
      actor: 'ai',
      target: position,
      result: result.shipSunk ? 'sunk' : (result.hit ? 'hit' : 'miss'),
      shipSunk: result.shipType,
      turnNumber: state.moves.length + 1,
      timestamp: new Date()
    }
    
    // Check win condition
    const winner = checkWinCondition({
      ...state,
      userBoard: state.userBoard,
      userShips: state.userShips,
      moves: [...state.moves, move]
    })
    
    // Update state
    set(prevState => ({
      gameState: {
        ...prevState.gameState,
        userBoard: prevState.gameState.userBoard, // Already mutated
        moves: [...prevState.gameState.moves, move],
        turn: winner ? prevState.gameState.turn : 'user',
        winner,
        phase: winner ? 'game-over' : 'playing',
        endedAt: winner ? new Date() : null
      }
    }))
  },
  
  // ========================================
  // UTILITY
  // ========================================
  setDifficulty: (difficulty) => {
    set({ difficulty })
  },
  
  reset: () => {
    set({ 
      gameState: createInitialState(),
      difficulty: 'medium'
    })
  },

  isPaused: false,

pauseGame: () => {
  set({ isPaused: true })
},

resumeGame: () => {
  set({ isPaused: false })
},

surrender: () => {
  set(state => ({
    gameState: {
      ...state.gameState,
      phase: 'game-over',
      winner: 'ai',
      endedAt: new Date()
    }
  }))
} 
}))