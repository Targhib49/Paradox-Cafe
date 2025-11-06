'use client'

import { useState } from 'react'
import { Board } from './Board'
import { useBattleship2v2Store } from '@/lib/stores/battleship2v2Store'

export function TrapPlacement() {
  const { gameState, placeTrap } = useBattleship2v2Store()
  const { userBoard, buddyBoard, alliesTeam } = gameState
  
  const [selectedBoard, setSelectedBoard] = useState<'user' | 'buddy'>('user')
  
  const trapsRemaining = 3 - alliesTeam.bombTraps.length
  
  const handleCellClick = (row: number, col: number) => {
    if (trapsRemaining === 0) return
    
    placeTrap(selectedBoard, { row, col })
  }
  
  const currentBoard = selectedBoard === 'user' ? userBoard : buddyBoard
  
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Control Panel */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Trap Info */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">
            💣 Bomb Traps
          </h3>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">💣</span>
              <div>
                <p className="font-semibold text-white">Trap Effect:</p>
                <ul className="text-xs text-gray-400 space-y-1 mt-1">
                  <li>• Enemy loses next turn</li>
                  <li>• Reveals 3x3 area around trap</li>
                  <li>• Trade: Intel for turn advantage</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Traps Placed:</span>
              <span className="text-xl font-bold text-white">
                {alliesTeam.bombTraps.length} / 3
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setSelectedBoard('user')}
              className={`w-full p-3 rounded-lg border-2 transition ${
                selectedBoard === 'user'
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-white/5 border-white/20 text-white hover:border-purple-500'
              }`}
            >
              Your Board
            </button>
            <button
              onClick={() => setSelectedBoard('buddy')}
              className={`w-full p-3 rounded-lg border-2 transition ${
                selectedBoard === 'buddy'
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-white/5 border-white/20 text-white hover:border-purple-500'
              }`}
            >
              Buddy's Board
            </button>
          </div>
        </div>
        
        {/* Strategy Tips */}
        <div className="glass p-4 rounded-xl border-2 border-purple-500/20">
          <div className="flex gap-2 text-sm">
            <span className="text-purple-400">💡</span>
            <div className="text-purple-300/80">
              <p className="font-semibold mb-1">Placement Tips:</p>
              <ul className="text-xs space-y-1">
                <li>• Protect special ships</li>
                <li>• Bait obvious attack spots</li>
                <li>• Mix defensive & offensive traps</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Board Display */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="glass px-6 py-3 rounded-lg">
          <p className="text-white font-semibold">
            Placing on: {selectedBoard === 'user' ? 'Your Board' : "Buddy's Board"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {trapsRemaining} trap{trapsRemaining !== 1 ? 's' : ''} remaining
          </p>
        </div>
        
        <Board
          board={currentBoard}
          isPlayerBoard={true}
          onCellClick={handleCellClick}
          clickable={trapsRemaining > 0}
          label={selectedBoard === 'user' ? 'YOUR BOARD' : "BUDDY'S BOARD"}
          specialShips={gameState.alliesTeam.specialShips.filter(s => s.boardOwner === selectedBoard)} 
          traps={gameState.alliesTeam.bombTraps.filter(t => t.boardOwner === selectedBoard)}           
        />
      </div>
    </div>
  )
}