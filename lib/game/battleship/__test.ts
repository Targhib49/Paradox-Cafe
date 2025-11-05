import { createEmptyBoard } from './boardUtils'
import { SHIP_CONFIGS } from './types'
import { placeShipsRandomly, placePlayerShipsRandomly } from './shipUtils'

// Test board creation
const board = createEmptyBoard()
console.log('✅ Board created:', board.length === 10 && board[0].length === 10)

// Test random ship placement (AI)
const aiShips = placeShipsRandomly(board, SHIP_CONFIGS)
console.log('✅ AI ships placed:', aiShips.length === 5)

// Test player random placement
const { board: playerBoard, ships: playerShips } = placePlayerShipsRandomly(SHIP_CONFIGS)
console.log('✅ Player ships randomized:', playerShips.length === 5)
console.log('Player ships:', playerShips.map(s => `${s.type} at ${s.position.row},${s.position.col} ${s.orientation}`))