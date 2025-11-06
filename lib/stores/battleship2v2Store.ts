import { create } from 'zustand'
import type {
  GameState2v2,
  SpecialShip,
  BombTrap,
  Position,
  Player,
  Board,
  Ship,
  Move,
  AttackResult2v2
} from '@/lib/game/battleship/types'
import { SHIP_CONFIGS, SPECIAL_SHIP_CONFIGS } from '@/lib/game/battleship/types'
import { createEmptyBoard } from '@/lib/game/battleship/boardUtils'
import {
  placeShip,
  placeShipsRandomly,
  createShip,
  canPlaceShip
} from '@/lib/game/battleship/shipUtils'
import {
  createSpecialShip,
  placeSpecialShip,
  allSpecialShipsSunk
} from '@/lib/game/battleship/specialShipUtils'
import {
  createBombTrap,
  checkTrapBeforeAttack,
  canPlaceTrap
} from '@/lib/game/battleship/trapUtils2v2'
import { processAttack2v2, isValidAttack2v2 } from '@/lib/game/battleship/attackUtils2v2'

// ============================================
// STORE INTERFACE
// ============================================

interface Battleship2v2Store {
  // State
  gameState: GameState2v2
  
  // Attack state (temporary)
  userSelectedTarget: { board: Player; position: Position } | null
  
  // Setup Phase Actions
  startNewGame: () => void
  placeUserRegularShip: (
    position: Position,
    shipType: string,
    orientation: 'horizontal' | 'vertical'
  ) => boolean
  randomizeUserRegularShips: () => void
  placeSpecialShip: (
    specialType: string,
    boardOwner: 'user' | 'buddy',
    position: Position,
    orientation: 'horizontal' | 'vertical'
  ) => boolean
  placeTrap: (
    boardOwner: 'user' | 'buddy',
    position: Position
  ) => boolean
  confirmSetup: () => void
  
  // Gameplay Actions
  selectUserTarget: (targetBoard: Player, position: Position) => void
  executeUserAttack: () => void
  executeBuddyAttack: () => void
  executeEnemyTurn: () => void
  
  // Game Controls
  isPaused: boolean
  pauseGame: () => void
  resumeGame: () => void
  surrender: () => void
  
  // Utility
  reset: () => void
}

// ============================================
// INITIAL STATE
// ============================================

const createInitial2v2State = (): GameState2v2 => ({
  mode: '2v2',
  phase: 'placement',
  turn: 'user',
  turnPhase: 'allies',
  
  // 4 Boards
  userBoard: createEmptyBoard(),
  buddyBoard: createEmptyBoard(),
  enemy1Board: createEmptyBoard(),
  enemy2Board: createEmptyBoard(),
  
  // Team Data
  alliesTeam: {
    regularShips: [],
    specialShips: [],
    bombTraps: []
  },
  enemiesTeam: {
    regularShips: [],
    specialShips: [],
    bombTraps: []
  },
  
  // Turn management
  skippedPlayers: [],
  
  // Buddy
  buddyPersona: 'max',
  
  moves: [],
  winner: null,
  startedAt: null,
  endedAt: null
})

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useBattleship2v2Store = create<Battleship2v2Store>((set, get) => ({
  gameState: createInitial2v2State(),
  isPaused: false,
  userSelectedTarget: null,
  
  // ========================================
  // START NEW GAME
  // ========================================
  startNewGame: () => {
    set({ 
      gameState: createInitial2v2State(),
      userSelectedTarget: null,
      isPaused: false
    })
  },
  
  // ========================================
  // RANDOMIZE PLAYER PLACEMENT
  // ========================================
  randomizeUserRegularShips: () => {
    const board = createEmptyBoard()
    const ships = placeShipsRandomly(board, SHIP_CONFIGS)
    
    set(state => ({
      gameState: {
        ...state.gameState,
        userBoard: board,
        alliesTeam: {
          ...state.gameState.alliesTeam,
          regularShips: ships
        }
      }
    }))
  },
  
  // ========================================
  // PLACE USER REGULAR SHIP (Manual)
  // ========================================
  placeUserRegularShip: (position, shipType, orientation) => {
    const state = get().gameState
    
    // Find ship config
    const config = SHIP_CONFIGS.find(c => c.type === shipType)
    if (!config) return false
    
    // Check if already placed
    const userShips = state.alliesTeam.regularShips.slice(0, 5)
    const alreadyPlaced = userShips.some(s => s.type === config.type)
    if (alreadyPlaced) return false
    
    // Validate placement
    if (!canPlaceShip(state.userBoard, position, config.length, orientation)) {
      return false
    }
    
    // Create and place ship
    const ship = createShip(config.type, config.length, position, orientation)
    const newBoard = state.userBoard.map(row => [...row])
    placeShip(newBoard, ship)
    
    set(prevState => ({
      gameState: {
        ...prevState.gameState,
        userBoard: newBoard,
        alliesTeam: {
          ...prevState.gameState.alliesTeam,
          regularShips: [...prevState.gameState.alliesTeam.regularShips, ship]
        }
      }
    }))
    
    return true
  },
  
  // ========================================
  // PLACE SPECIAL SHIP (choose board)
  // ========================================
  placeSpecialShip: (specialType, boardOwner, position, orientation) => {
    const state = get().gameState
    
    // Find special ship config
    const config = SPECIAL_SHIP_CONFIGS.find(c => c.type === specialType)
    if (!config) return false
    
    // Check if already placed
    const alreadyPlaced = state.alliesTeam.specialShips.some(
      s => s.specialType === config.type
    )
    if (alreadyPlaced) return false
    
    // Get target board
    const targetBoard = boardOwner === 'user' ? state.userBoard : state.buddyBoard
    
    // Validate placement
    if (!canPlaceShip(targetBoard, position, config.length, orientation)) {
      return false
    }
    
    // Create special ship
    const specialShip = createSpecialShip(
      config.type,
      config.length,
      position,
      orientation,
      boardOwner
    )
    
    // Clone board and place ship
    const newBoard = targetBoard.map(row => [...row])
    placeSpecialShip(newBoard, specialShip)
    
    set(prevState => ({
      gameState: {
        ...prevState.gameState,
        [boardOwner === 'user' ? 'userBoard' : 'buddyBoard']: newBoard,
        alliesTeam: {
          ...prevState.gameState.alliesTeam,
          specialShips: [...prevState.gameState.alliesTeam.specialShips, specialShip]
        }
      }
    }))
    
    return true
  },
  
  // ========================================
  // PLACE TRAP
  // ========================================
  placeTrap: (boardOwner, position) => {
    const state = get().gameState
    
    // Check trap limit (3 per team)
    if (state.alliesTeam.bombTraps.length >= 3) return false
    
    // Get target board
    const targetBoard = boardOwner === 'user' ? state.userBoard : state.buddyBoard
    
    // Validate placement
    if (!canPlaceTrap(targetBoard, position, state.alliesTeam.bombTraps, boardOwner)) {
      return false
    }
    
    // Create trap
    const trap = createBombTrap(position, boardOwner)
    
    set(prevState => ({
      gameState: {
        ...prevState.gameState,
        alliesTeam: {
          ...prevState.gameState.alliesTeam,
          bombTraps: [...prevState.gameState.alliesTeam.bombTraps, trap]
        }
      }
    }))
    
    return true
  },
  
  // ========================================
  // CONFIRM SETUP & START GAME
  // ========================================
  confirmSetup: () => {
    const state = get().gameState
    
    // Validate setup complete
    if (state.alliesTeam.regularShips.length !== 5) {
      console.error('Must place 5 regular ships')
      return
    }
    if (state.alliesTeam.specialShips.length !== 3) {
      console.error('Must place 3 special ships')
      return
    }
    if (state.alliesTeam.bombTraps.length !== 3) {
      console.error('Must place 3 bomb traps')
      return
    }
    
    // Setup enemy team
    // Place regular ships on both enemy boards
    const enemy1Board = createEmptyBoard()
    const enemy1Ships = placeShipsRandomly(enemy1Board, SHIP_CONFIGS)
    
    const enemy2Board = createEmptyBoard()
    const enemy2Ships = placeShipsRandomly(enemy2Board, SHIP_CONFIGS)
    
    // Place buddy's regular ships
    const buddyBoard = createEmptyBoard()
    const buddyShips = placeShipsRandomly(buddyBoard, SHIP_CONFIGS)
    
    // Place enemy special ships randomly
    const enemySpecialShips: SpecialShip[] = []
    
    SPECIAL_SHIP_CONFIGS.forEach((config) => {
      const boardOwner: Player = Math.random() > 0.5 ? 'enemy1' : 'enemy2'
      const board = boardOwner === 'enemy1' ? enemy1Board : enemy2Board
      
      let placed = false
      let attempts = 0
      
      while (!placed && attempts < 100) {
        const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical'
        const position = {
          row: Math.floor(Math.random() * 10),
          col: Math.floor(Math.random() * 10)
        }
        
        if (canPlaceShip(board, position, config.length, orientation)) {
          const specialShip = createSpecialShip(
            config.type,
            config.length,
            position,
            orientation,
            boardOwner
          )
          placeSpecialShip(board, specialShip)
          enemySpecialShips.push(specialShip)
          placed = true
        }
        attempts++
      }
    })
    
    // Place enemy traps randomly
    const enemyTraps: BombTrap[] = []
    for (let i = 0; i < 3; i++) {
      const boardOwner: Player = Math.random() > 0.5 ? 'enemy1' : 'enemy2'
      const board = boardOwner === 'enemy1' ? enemy1Board : enemy2Board
      
      let placed = false
      let attempts = 0
      
      while (!placed && attempts < 100) {
        const position = {
          row: Math.floor(Math.random() * 10),
          col: Math.floor(Math.random() * 10)
        }
        
        if (canPlaceTrap(board, position, enemyTraps, boardOwner)) {
          const trap = createBombTrap(position, boardOwner)
          enemyTraps.push(trap)
          placed = true
        }
        attempts++
      }
    }
    
    set(prevState => ({
      gameState: {
        ...prevState.gameState,
        buddyBoard,
        enemy1Board,
        enemy2Board,
        alliesTeam: {
          ...prevState.gameState.alliesTeam,
          regularShips: [...prevState.gameState.alliesTeam.regularShips, ...buddyShips]
        },
        enemiesTeam: {
          regularShips: [...enemy1Ships, ...enemy2Ships],
          specialShips: enemySpecialShips,
          bombTraps: enemyTraps
        },
        phase: 'playing',
        startedAt: new Date()
      }
    }))
  },
  
  // ========================================
  // SELECT USER TARGET
  // ========================================
  selectUserTarget: (targetBoard, position) => {
    set({ userSelectedTarget: { board: targetBoard, position } })
  },
  
  // ========================================
  // EXECUTE USER ATTACK
  // ========================================
  executeUserAttack: () => {
    const state = get().gameState
    const target = get().userSelectedTarget
    
    if (!target) return
    if (state.phase !== 'playing') return
    if (state.turnPhase !== 'allies') return
    
    // Check if user is skipped
    if (state.skippedPlayers.includes('user')) {
      console.log('User turn skipped due to trap')
      set({ userSelectedTarget: null })
      get().executeBuddyAttack()
      return
    }
    
    // Get target board and ships
    const targetBoard = target.board === 'enemy1' ? state.enemy1Board : state.enemy2Board
    const targetShips = state.enemiesTeam.regularShips
    const targetSpecialShips = state.enemiesTeam.specialShips
    const targetTraps = state.enemiesTeam.bombTraps
    
    // Validate attack
    if (!isValidAttack2v2(targetBoard, target.position, 'user', target.board)) {
      console.error('Invalid attack position')
      return
    }
    
    // Process attack with trap checking
    const result = processAttack2v2(
      targetBoard,
      targetShips,
      targetSpecialShips,
      targetTraps,
      target.board,
      target.position,
      'user'
    )
    
    // Record move
    const move: Move = {
      actor: 'user',
      target: target.position,
      result: result.shipSunk ? 'sunk' : (result.hit ? 'hit' : 'miss'),
      shipSunk: result.shipType,
      turnNumber: state.moves.length + 1,
      timestamp: new Date()
    }
    
    // Check if trap triggered
    let newSkippedPlayers = [...state.skippedPlayers]
    if (result.trapTriggered) {
      newSkippedPlayers.push('user')
      console.log('User triggered trap! Next turn skipped.')
    }
    
    // Update board
    const updatedBoards = {
      enemy1Board: target.board === 'enemy1' ? targetBoard : state.enemy1Board,
      enemy2Board: target.board === 'enemy2' ? targetBoard : state.enemy2Board
    }
    
    // Check win condition
    const enemySpecialsAllSunk = allSpecialShipsSunk(state.enemiesTeam.specialShips)
    const winner = enemySpecialsAllSunk ? 'user' : null
    
    set(prevState => ({
      gameState: {
        ...prevState.gameState,
        ...updatedBoards,
        moves: [...prevState.gameState.moves, move],
        skippedPlayers: newSkippedPlayers,
        winner,
        phase: winner ? 'game-over' : 'playing',
        endedAt: winner ? new Date() : null
      },
      userSelectedTarget: null
    }))
    
    if (winner) return
    
    // Execute buddy attack after brief delay
    setTimeout(() => {
      get().executeBuddyAttack()
    }, 1000)
  },
  
  // ========================================
  // EXECUTE BUDDY ATTACK
  // ========================================
  executeBuddyAttack: () => {
    const state = get().gameState
    
    if (state.phase !== 'playing') return
    if (state.turnPhase !== 'allies') return
    
    // Check if buddy is skipped
    if (state.skippedPlayers.includes('buddy')) {
      console.log('Buddy turn skipped due to trap')
      set(prevState => ({
        gameState: {
          ...prevState.gameState,
          turnPhase: 'enemies',
          skippedPlayers: prevState.gameState.skippedPlayers.filter(
            p => p !== 'user' && p !== 'buddy'
          )
        }
      }))
      
      setTimeout(() => {
        get().executeEnemyTurn()
      }, 1500)
      return
    }
    
    // Simple buddy AI: Pick random untargeted cell on random enemy board
    const targetBoard: Player = Math.random() > 0.5 ? 'enemy1' : 'enemy2'
    const board = targetBoard === 'enemy1' ? state.enemy1Board : state.enemy2Board
    
    // Get untargeted cells
    const untargeted = board.flat().filter(cell => 
      cell.state === 'empty' || cell.state === 'ship' || cell.state === 'unknown'
    )
    
    if (untargeted.length === 0) {
      set(prevState => ({
        gameState: {
          ...prevState.gameState,
          turnPhase: 'enemies'
        }
      }))
      setTimeout(() => get().executeEnemyTurn(), 1500)
      return
    }
    
    const randomCell = untargeted[Math.floor(Math.random() * untargeted.length)]
    const position = { row: randomCell.row, col: randomCell.col }
    
    // Process attack
    const targetShips = state.enemiesTeam.regularShips
    const targetSpecialShips = state.enemiesTeam.specialShips
    const targetTraps = state.enemiesTeam.bombTraps
    
    const result = processAttack2v2(
      board,
      targetShips,
      targetSpecialShips,
      targetTraps,
      targetBoard,
      position,
      'buddy'
    )
    
    // Record move
    const move: Move = {
      actor: 'ai',
      target: position,
      result: result.shipSunk ? 'sunk' : (result.hit ? 'hit' : 'miss'),
      shipSunk: result.shipType,
      turnNumber: state.moves.length + 1,
      timestamp: new Date()
    }
    
    // Check if trap triggered
    let newSkippedPlayers: Player[] = state.skippedPlayers.filter(p => p !== 'user' && p !== 'buddy')
    if (result.trapTriggered) {
      newSkippedPlayers.push('buddy')
      console.log('Buddy triggered trap! Next turn skipped.')
    }
    
    // Update boards
    const updatedBoards = {
      enemy1Board: targetBoard === 'enemy1' ? board : state.enemy1Board,
      enemy2Board: targetBoard === 'enemy2' ? board : state.enemy2Board
    }
    
    // Check win condition
    const enemySpecialsAllSunk = allSpecialShipsSunk(state.enemiesTeam.specialShips)
    const winner = enemySpecialsAllSunk ? 'user' : null
    
    set(prevState => ({
      gameState: {
        ...prevState.gameState,
        ...updatedBoards,
        moves: [...prevState.gameState.moves, move],
        turnPhase: winner ? prevState.gameState.turnPhase : 'enemies',
        skippedPlayers: newSkippedPlayers,
        winner,
        phase: winner ? 'game-over' : 'playing',
        endedAt: winner ? new Date() : null
      }
    }))
    
    if (winner) return
    
    setTimeout(() => {
      get().executeEnemyTurn()
    }, 1500)
  },
  
  // ========================================
  // EXECUTE ENEMY TURN
  // ========================================
  executeEnemyTurn: () => {
    const state = get().gameState
    
    if (state.phase !== 'playing') return
    if (state.turnPhase !== 'enemies') return
    
    let updatedUserBoard = state.userBoard
    let updatedBuddyBoard = state.buddyBoard
    let newSkippedPlayers: Player[] = state.skippedPlayers.filter(p => p !== 'enemy1' && p !== 'enemy2')
    const newMoves: Move[] = []
    
    // Enemy 1 attack
    const enemy1Skipped = state.skippedPlayers.includes('enemy1')
    if (!enemy1Skipped) {
      const targetBoard: 'user' | 'buddy' = Math.random() > 0.5 ? 'user' : 'buddy'
      const board = targetBoard === 'user' ? updatedUserBoard : updatedBuddyBoard
      
      const untargeted = board.flat().filter(cell => 
        cell.state === 'empty' || cell.state === 'ship'
      )
      
      if (untargeted.length > 0) {
        const randomCell = untargeted[Math.floor(Math.random() * untargeted.length)]
        const position = { row: randomCell.row, col: randomCell.col }
        
        const result = processAttack2v2(
          board,
          state.alliesTeam.regularShips,
          state.alliesTeam.specialShips,
          state.alliesTeam.bombTraps,
          targetBoard,
          position,
          'enemy1'
        )
        
        if (targetBoard === 'user') {
          updatedUserBoard = board
        } else {
          updatedBuddyBoard = board
        }
        
        if (result.trapTriggered) {
          newSkippedPlayers.push('enemy1')
        }
        
        newMoves.push({
          actor: 'ai',
          target: position,
          result: result.shipSunk ? 'sunk' : (result.hit ? 'hit' : 'miss'),
          shipSunk: result.shipType,
          turnNumber: state.moves.length + newMoves.length + 1,
          timestamp: new Date()
        })
      }
    }
    
    // Enemy 2 attack
    const enemy2Skipped = state.skippedPlayers.includes('enemy2')
    if (!enemy2Skipped) {
      const targetBoard: 'user' | 'buddy' = Math.random() > 0.5 ? 'user' : 'buddy'
      const board = targetBoard === 'user' ? updatedUserBoard : updatedBuddyBoard
      
      const untargeted = board.flat().filter(cell => 
        cell.state === 'empty' || cell.state === 'ship'
      )
      
      if (untargeted.length > 0) {
        const randomCell = untargeted[Math.floor(Math.random() * untargeted.length)]
        const position = { row: randomCell.row, col: randomCell.col }
        
        const result = processAttack2v2(
          board,
          state.alliesTeam.regularShips,
          state.alliesTeam.specialShips,
          state.alliesTeam.bombTraps,
          targetBoard,
          position,
          'enemy2'
        )
        
        if (targetBoard === 'user') {
          updatedUserBoard = board
        } else {
          updatedBuddyBoard = board
        }
        
        if (result.trapTriggered) {
          newSkippedPlayers.push('enemy2')
        }
        
        newMoves.push({
          actor: 'ai',
          target: position,
          result: result.shipSunk ? 'sunk' : (result.hit ? 'hit' : 'miss'),
          shipSunk: result.shipType,
          turnNumber: state.moves.length + newMoves.length + 1,
          timestamp: new Date()
        })
      }
    }
    
    // Check win condition
    const alliedSpecialsAllSunk = allSpecialShipsSunk(state.alliesTeam.specialShips)
    const winner = alliedSpecialsAllSunk ? 'ai' : null
    
    set(prevState => ({
      gameState: {
        ...prevState.gameState,
        userBoard: updatedUserBoard,
        buddyBoard: updatedBuddyBoard,
        moves: [...prevState.gameState.moves, ...newMoves],
        turnPhase: winner ? prevState.gameState.turnPhase : 'allies',
        skippedPlayers: newSkippedPlayers,
        winner,
        phase: winner ? 'game-over' : 'playing',
        endedAt: winner ? new Date() : null
      }
    }))
  },
  
  // ========================================
  // GAME CONTROLS
  // ========================================
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
  },
  
  // ========================================
  // RESET
  // ========================================
  reset: () => {
    set({
      gameState: createInitial2v2State(),
      isPaused: false,
      userSelectedTarget: null
    })
  }
}))