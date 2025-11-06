'use client'

import type { Board as BoardType, Cell as CellType, SpecialShip, BombTrap } from '@/lib/game/battleship/types'
import { Cell } from './Cell'

interface BoardProps {
  board: BoardType
  isPlayerBoard: boolean
  onCellClick?: (row: number, col: number) => void
  disabled?: boolean
  clickable?: boolean
  label: string
  specialShips?: SpecialShip[]  // NEW: Pass special ships to highlight
  traps?: BombTrap[]            // NEW: Pass traps to show
}

export function Board({ 
  board, 
  isPlayerBoard, 
  onCellClick, 
  disabled = false,
  clickable = false,
  label,
  specialShips = [],  // NEW
  traps = []          // NEW
}: BoardProps) {
  const handleCellClick = (row: number, col: number) => {
    if (disabled) return
    onCellClick?.(row, col)
  }
  
  // Helper to check if cell is part of special ship
  const isSpecialShipCell = (row: number, col: number): boolean => {
    const cell = board[row][col]
    if (!cell.shipId) return false
    
    return specialShips.some(ship => ship.id === cell.shipId)
  }
  
  // Helper to check if cell has trap
  const hasTrapAtCell = (row: number, col: number): boolean => {
    return traps.some(trap => 
      trap.position.row === row && 
      trap.position.col === col &&
      !trap.triggered
    )
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
                clickable={clickable}
                isSpecialShip={isSpecialShipCell(rowIndex, colIndex)}  // NEW
                hasTrap={hasTrapAtCell(rowIndex, colIndex)}            // NEW
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend (only for player boards) */}
      {isPlayerBoard && (specialShips.length > 0 || traps.length > 0) && (
        <div className="flex justify-center gap-4 text-xs mt-2">
          {specialShips.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-linear-to-br from-yellow-500 to-amber-600 rounded border border-white/20"></div>
              <span className="text-gray-400">Special Ships</span>
            </div>
          )}
          {traps.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-purple-400">💣</span>
              <span className="text-gray-400">Bomb Traps</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[#6366f1] rounded border border-white/20"></div>
            <span className="text-gray-400">Regular Ships</span>
          </div>
        </div>
      )}
    </div>
  )
}