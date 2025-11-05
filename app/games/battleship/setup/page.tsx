'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBattleshipStore } from '@/lib/stores/battleshipStore'
import { SHIP_CONFIGS } from '@/lib/game/battleship/types'
import type { Position } from '@/lib/game/battleship/types'
import { Board } from '@/components/games/battleship/Board'

export default function BattleshipSetupPage() {
  const router = useRouter()
  const { gameState, placeUserShip, randomizePlacement, confirmPlacement, startNewGame } = useBattleshipStore()
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
  
  const handleClearAll = () => {
    if (confirm('Clear all ships and start over?')) {
      startNewGame()
      setSelectedShipType(SHIP_CONFIGS[0].type)
      setOrientation('horizontal')
    }
  }
  
  const handleConfirmAndStart = () => {
    confirmPlacement()
    router.push('/games/battleship/play')
  }
  
  return (
    <div className="min-h-screen bg-paradox-dark p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Place Your Fleet
          </h1>
          <p className="text-gray-400">
            Position your ships strategically
          </p>
        </div>
        
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Ship Selection Panel */}
          <div className="space-y-4">
            {/* Ship List */}
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">Your Ships</h3>
              
              <div className="space-y-2">
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
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progress:</span>
                  <span className="text-white font-semibold">
                    {userShips.length} / 5
                  </span>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">Controls</h3>
              
              {selectedShipType && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">
                    Orientation:
                  </label>
                  <button
                    onClick={toggleOrientation}
                    className="w-full px-4 py-3 bg-paradox-blue-600 text-white rounded-lg hover:bg-paradox-blue-700 transition"
                  >
                    {orientation === 'horizontal' ? '→ Horizontal' : '↓ Vertical'}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to rotate ship
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <button
                  onClick={randomizePlacement}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                >
                  🎲 Randomize All
                </button>
                
                <button
                  onClick={handleClearAll}
                  disabled={userShips.length === 0}
                  className="w-full px-4 py-3 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed border border-red-700"
                >
                  🗑️ Clear All
                </button>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="glass p-4 rounded-xl border-2 border-blue-500/20">
              <div className="flex gap-2 text-sm text-blue-300">
                <span>💡</span>
                <div>
                  <p className="font-semibold mb-1">Quick Tips:</p>
                  <ul className="text-xs space-y-1 text-blue-200/80">
                    <li>• Select a ship from the list</li>
                    <li>• Toggle orientation if needed</li>
                    <li>• Click the board to place</li>
                    <li>• Use randomize for quick setup</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Board Area */}
          <div className="flex flex-col items-center gap-6">
            <Board
              board={userBoard}
              isPlayerBoard={true}
              onCellClick={handleCellClick}
              label="YOUR BOARD"
              clickable={true}
            />
            
            {selectedShipType && (
              <div className="text-center text-sm text-gray-400 glass px-4 py-2 rounded-lg">
                Placing: <span className="text-white font-semibold">
                  {SHIP_CONFIGS.find(c => c.type === selectedShipType)?.name}
                </span> ({orientation})
              </div>
            )}
            
            {/* Start Button */}
            <button
              onClick={handleConfirmAndStart}
              disabled={userShips.length !== 5}
              className="px-8 py-4 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold min-w-[200px]"
            >
              {userShips.length === 5 ? '⚓ Launch Battle!' : `Place ${5 - userShips.length} more...`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}