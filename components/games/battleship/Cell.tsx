'use client'

import type { Cell as CellType } from '@/lib/game/battleship/types'
import { cn } from '@/lib/utils/cn'

interface CellProps {
  cell: CellType
  isPlayerBoard: boolean
  onClick?: () => void
  disabled?: boolean
  clickable?: boolean  // NEW PROP
}

export function Cell({ 
  cell, 
  isPlayerBoard, 
  onClick, 
  disabled,
  clickable = false  // DEFAULT FALSE
}: CellProps) {
  const { state } = cell
  
  // Determine cell appearance based on state
  const getCellStyle = () => {
    if (isPlayerBoard) {
      // Player can see their own ships
      switch (state) {
        case 'empty':
          return 'bg-[#1e3a5f] hover:bg-[#2d5a7f]'
        case 'ship':
          return 'bg-[#6366f1]' // Indigo - ship
        case 'hit':
          return 'bg-red-500' // Red - hit
        case 'miss':
          return 'bg-slate-500' // Gray - miss
        case 'sunk':
          return 'bg-red-900' // Dark red - sunk
        default:
          return 'bg-[#1e3a5f]'
      }
    } else {
      // Enemy board - fog of war
      switch (state) {
        case 'empty':
        case 'ship': // Hide enemy ships
        case 'unknown':
          return 'bg-[#0f1419] hover:bg-[#1e3a5f] cursor-pointer'
        case 'hit':
          return 'bg-orange-500' // Orange - hit
        case 'miss':
          return 'bg-slate-500' // Gray - miss
        case 'sunk':
          return 'bg-red-900' // Dark red - sunk
        default:
          return 'bg-[#0f1419]'
      }
    }
  }
  
  // Cell content (markers)
  const getCellContent = () => {
    if (isPlayerBoard) {
      switch (state) {
        case 'hit':
          return <span className="text-white text-lg">✕</span>
        case 'miss':
          return <span className="text-white text-sm">○</span>
        case 'sunk':
          return <span className="text-white text-lg">✕</span>
        default:
          return null
      }
    } else {
      switch (state) {
        case 'hit':
          return <span className="text-white text-lg">🔥</span>
        case 'miss':
          return <span className="text-white text-sm">○</span>
        case 'sunk':
          return <span className="text-white text-lg">💀</span>
        default:
          return null
      }
    }
  }
  
  // Determine if this cell should be clickable
  const isClickable = clickable && !disabled
  
  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={cn(
        'w-8 h-8 border border-white/10 flex items-center justify-center transition-colors',
        getCellStyle(),
        isClickable ? 'cursor-pointer' : 'cursor-default'
      )}
      type="button"
    >
      {getCellContent()}
    </button>
  )
}