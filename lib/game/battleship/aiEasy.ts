import type { Board, Position } from './types'
import { getUntargetedCells } from './boardUtils'

/**
 * Easy AI - Random shooting
 * Win rate: ~20-30% against beginners
 */
export function getEasyAIMove(board: Board): Position {
  const untargeted = getUntargetedCells(board)
  
  if (untargeted.length === 0) {
    throw new Error('No valid moves available')
  }
  
  // Pick random cell
  const randomCell = untargeted[Math.floor(Math.random() * untargeted.length)]
  
  return {
    row: randomCell.row,
    col: randomCell.col
  }
}