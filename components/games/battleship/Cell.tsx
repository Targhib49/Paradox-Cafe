'use client'

import type { Cell as CellType } from '@/lib/game/battleship/types'
import { cn } from '@/lib/utils/cn'

interface CellProps {
  cell: CellType
  isPlayerBoard: boolean
  onClick?: () => void
  disabled?: boolean
  clickable?: boolean
  isSpecialShip?: boolean  // NEW: Mark if this is a special ship
  hasTrap?: boolean       // NEW: Mark if this cell has a trap
}

export function Cell({ 
  cell, 
  isPlayerBoard, 
  onClick, 
  disabled,
  clickable = false,
  isSpecialShip = false,   // NEW
  hasTrap = false          // NEW
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
          // Color-code based on ship type
          if (isSpecialShip) {
            return 'bg-gradient-to-br from-yellow-500 to-amber-600' // Gold for special ships
          }
          return 'bg-[#6366f1]' // Indigo for regular ships
        case 'hit':
          return 'bg-red-500' // Red - hit
        case 'miss':
          return 'bg-slate-500' // Gray - miss
        case 'sunk':
          if (isSpecialShip) {
            return 'bg-gradient-to-br from-red-900 to-orange-900' // Dark gold-red for sunk special
          }
          return 'bg-red-900' // Dark red - sunk regular
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
    // Show trap indicator (only on player boards, only when empty or has ship)
    if (isPlayerBoard && hasTrap && (state === 'empty' || state === 'ship')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-purple-400 text-xs">💣</span>
        </div>
      )
    }
    
    if (isPlayerBoard) {
      switch (state) {
        case 'ship':
          // Show special ship indicator
          if (isSpecialShip) {
            return <span className="text-yellow-200 text-xs">⭐</span>
          }
          return null
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
        'w-8 h-8 border border-white/10 flex items-center justify-center transition-colors relative',
        getCellStyle(),
        isClickable ? 'cursor-pointer' : 'cursor-default',
        // Add special glow for special ships
        isPlayerBoard && isSpecialShip && state === 'ship' && 'ring-1 ring-yellow-400/30'
      )}
      type="button"
    >
      {getCellContent()}
    </button>
  )
}