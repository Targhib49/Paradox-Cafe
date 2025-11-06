'use client'

import { useState } from 'react'
import type { Move } from '@/lib/game/battleship/types'
import { positionToCoord } from '@/lib/game/battleship/boardUtils'

interface MoveHistoryProps {
  moves: Move[]
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const recentMoves = moves.slice(-5).reverse()
  
  return (
    <div className="glass p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Recent Moves</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-paradox-purple-400 hover:text-paradox-purple-300 transition"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className="space-y-2">
        {(isExpanded ? moves.reverse() : recentMoves).map((move, index) => {
          const coord = positionToCoord(move.target)
          const isUser = move.actor === 'user'
          
          return (
            <div
              key={index}
              className={`text-xs p-2 rounded ${
                isUser ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={isUser ? 'text-green-400' : 'text-red-400'}>
                  {isUser ? 'You' : 'Enemy'}
                </span>
                <span className="text-gray-400">{coord}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`font-semibold ${
                  move.result === 'sunk' 
                    ? 'text-red-400' 
                    : move.result === 'hit'
                    ? 'text-orange-400'
                    : 'text-gray-400'
                }`}>
                  {move.result === 'sunk' ? '💥 SUNK' : move.result === 'hit' ? '🎯 HIT' : '💧 MISS'}
                </span>
                {move.shipSunk && (
                  <span className="text-xs text-gray-500">
                    ({move.shipSunk})
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {moves.length === 0 && (
        <p className="text-xs text-gray-500 text-center py-4">
          No moves yet
        </p>
      )}
    </div>
  )
}