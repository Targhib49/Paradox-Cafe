'use client'

import type { Board as BoardType, Cell as CellType } from '@/lib/game/battleship/types'
import { Cell } from './Cell'

interface BoardProps {
  board: BoardType
  isPlayerBoard: boolean
  onCellClick?: (row: number, col: number) => void
  disabled?: boolean
  clickable?: boolean  // ADD THIS
  label: string
}

export function Board({ 
  board, 
  isPlayerBoard, 
  onCellClick, 
  disabled = false,
  clickable = false,  // ADD THIS
  label 
}: BoardProps) {
  const handleCellClick = (row: number, col: number) => {
    if (disabled) return
    onCellClick?.(row, col)
  }
  
  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-white">{label}</h3>
        <p className="text-xs text-gray-400">
          {isPlayerBoard ? 'Your fleet' : 'Enemy waters'}
        </p>
      </div>
      
      {/* Board Grid */}
      <div className="inline-block bg-paradox-midnight p-4 rounded-xl">
        {/* Column Labels (A-J) */}
        <div className="flex mb-1">
          <div className="w-6" /> {/* Spacer for row numbers */}
          {Array.from({ length: 10 }, (_, i) => (
            <div 
              key={i} 
              className="w-8 h-6 flex items-center justify-center text-xs font-mono text-gray-400"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        
        {/* Grid Rows */}
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {/* Row Number (1-10) */}
            <div className="w-6 h-8 flex items-center justify-center text-xs font-mono text-gray-400">
              {rowIndex + 1}
            </div>
            
            {/* Cells */}
            {row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                isPlayerBoard={isPlayerBoard}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={disabled}
                clickable={clickable}  // PASS IT DOWN
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}