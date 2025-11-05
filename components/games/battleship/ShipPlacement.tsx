'use client'

import { useState } from 'react'
import { SHIP_CONFIGS } from '@/lib/game/battleship/types'
import type { Position } from '@/lib/game/battleship/types'
import { Board } from './Board'
import { useBattleshipStore } from '@/lib/stores/battleshipStore'

export function ShipPlacement() {
  const { gameState, placeUserShip, randomizePlacement, confirmPlacement } = useBattleshipStore()
  const { userBoard, userShips } = gameState
  
  const [selectedShipType, setSelectedShipType] = useState<string | null>(null)
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  
  // Get ships that haven't been placed yet
  const unplacedShips = SHIP_CONFIGS.filter(
    config => !userShips.some(ship => ship.type === config.type)
  )
  
  const handleCellClick = (row: number, col: number) => {
    if (!selectedShipType) return
    
    const success = placeUserShip(selectedShipType, { row, col }, orientation)
    
    if (success) {
      // Auto-select next unplaced ship
      const nextUnplaced = SHIP_CONFIGS.find(
        config => !userShips.some(ship => ship.type === config.type) && config.type !== selectedShipType
      )
      setSelectedShipType(nextUnplaced?.type || null)
    }
  }
  
  const handleShipSelect = (shipType: string) => {
    setSelectedShipType(shipType)
  }
  
  const toggleOrientation = () => {
    setOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')
  }
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Ship Selection Panel */}
      <div className="glass p-6 rounded-xl w-full lg:w-80">
        <h3 className="text-xl font-bold text-white mb-4">Place Your Ships</h3>
        
        <p className="text-sm text-gray-400 mb-4">
          Select a ship, then click on the board to place it.
        </p>
        
        {/* Ship List */}
        <div className="space-y-2 mb-6">
          {SHIP_CONFIGS.map(config => {
            const isPlaced = userShips.some(ship => ship.type === config.type)
            const isSelected = selectedShipType === config.type
            
            return (
              <button
                key={config.type}
                onClick={() => !isPlaced && handleShipSelect(config.type)}
                disabled={isPlaced}
                className={`w-full p-3 rounded-lg border-2 transition text-left ${
                  isPlaced 
                    ? 'bg-green-900/20 border-green-700 text-green-400 cursor-not-allowed'
                    : isSelected
                    ? 'bg-paradox-purple-600 border-paradox-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-white hover:border-paradox-purple-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{config.name}</p>
                    <p className="text-xs opacity-75">{config.length} cells</p>
                  </div>
                  {isPlaced && <span className="text-xl">✓</span>}
                </div>
              </button>
            )
          })}
        </div>
        
        {/* Orientation Toggle */}
        {selectedShipType && (
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Orientation:</label>
            <button
              onClick={toggleOrientation}
              className="w-full px-4 py-3 bg-paradox-blue-600 text-white rounded-lg hover:bg-paradox-blue-700 transition"
            >
              {orientation === 'horizontal' ? '→ Horizontal' : '↓ Vertical'}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Press to rotate ship
            </p>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="space-y-2">
          <button
            onClick={randomizePlacement}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
          >
            🎲 Randomize All
          </button>
          
          <button
            onClick={confirmPlacement}
            disabled={userShips.length !== 5}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {userShips.length === 5 ? '✓ Start Game' : `Place ${5 - userShips.length} more ship${5 - userShips.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
      
      {/* Board */}
      <div className="flex-1">
        <Board
          board={userBoard}
          isPlayerBoard={true}
          onCellClick={handleCellClick}
          label="YOUR BOARD - Click to place ships"
        />
        
        {selectedShipType && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Placing: <span className="text-white font-semibold">
              {SHIP_CONFIGS.find(c => c.type === selectedShipType)?.name}
            </span> ({orientation})
          </div>
        )}
      </div>
    </div>
  )
}