'use client'

import { useState } from 'react'
import { SPECIAL_SHIP_CONFIGS } from '@/lib/game/battleship/types'
import type { SpecialShipType } from '@/lib/game/battleship/types'
import { Board } from './Board'
import { useBattleship2v2Store } from '@/lib/stores/battleship2v2Store'

export function SpecialShipPlacement() {
  const { gameState, placeSpecialShip } = useBattleship2v2Store()
  const { userBoard, buddyBoard, alliesTeam } = gameState
  
  const [selectedSpecialType, setSelectedSpecialType] = useState<SpecialShipType | null>('commander')
  const [selectedBoard, setSelectedBoard] = useState<'user' | 'buddy'>('user')
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  
  // Get unplaced special ships
  const unplacedSpecials = SPECIAL_SHIP_CONFIGS.filter(
    config => !alliesTeam.specialShips.some(ship => ship.specialType === config.type)
  )
  
  const handleCellClick = (row: number, col: number) => {
    if (!selectedSpecialType) return
    
    const success = placeSpecialShip(
      selectedSpecialType,
      selectedBoard,
      { row, col },
      orientation
    )
    
    if (success) {
      // Auto-select next unplaced special ship
      const nextUnplaced = SPECIAL_SHIP_CONFIGS.find(
        config => 
          !alliesTeam.specialShips.some(ship => ship.specialType === config.type) &&
          config.type !== selectedSpecialType
      )
      setSelectedSpecialType(nextUnplaced?.type || null)
    }
  }
  
  const toggleOrientation = () => {
    setOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')
  }
  
  const currentBoard = selectedBoard === 'user' ? userBoard : buddyBoard
  
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Control Panel */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Special Ship Selection */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">
            ⭐ Special Ships
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            These are your win conditions! Choose wisely where to hide them.
          </p>
          
          <div className="space-y-2">
            {SPECIAL_SHIP_CONFIGS.map(config => {
              const isPlaced = alliesTeam.specialShips.some(
                ship => ship.specialType === config.type
              )
              const isSelected = selectedSpecialType === config.type
              
              return (
                <button
                  key={config.type}
                  onClick={() => !isPlaced && setSelectedSpecialType(config.type)}
                  disabled={isPlaced}
                  className={`w-full p-3 rounded-lg border-2 transition text-left ${
                    isPlaced
                      ? 'bg-green-900/20 border-green-700 text-green-400 cursor-not-allowed'
                      : isSelected
                      ? 'bg-yellow-600 border-yellow-400 text-white'
                      : 'bg-white/5 border-white/20 text-white hover:border-yellow-500'
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
          
          <div className="mt-4 pt-4 border-t border-white/10 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Progress:</span>
              <span className="text-white font-semibold">
                {alliesTeam.specialShips.length} / 3
              </span>
            </div>
          </div>
        </div>
        
        {/* Board Selection */}
        {selectedSpecialType && (
          <div className="glass p-6 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Choose Board
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => setSelectedBoard('user')}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  selectedBoard === 'user'
                    ? 'bg-paradox-blue-600 border-paradox-blue-400 text-white'
                    : 'bg-white/5 border-white/20 text-white hover:border-paradox-blue-500'
                }`}
              >
                <p className="font-semibold mb-1">Your Board</p>
                <p className="text-xs opacity-75">
                  Easier to defend, but riskier if found
                </p>
              </button>
              
              <button
                onClick={() => setSelectedBoard('buddy')}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  selectedBoard === 'buddy'
                    ? 'bg-paradox-blue-600 border-paradox-blue-400 text-white'
                    : 'bg-white/5 border-white/20 text-white hover:border-paradox-blue-500'
                }`}
              >
                <p className="font-semibold mb-1">Buddy's Board</p>
                <p className="text-xs opacity-75">
                  Ultimate misdirection, split defense
                </p>
              </button>
            </div>
            
            {/* Orientation */}
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">
                Orientation:
              </label>
              <button
                onClick={toggleOrientation}
                className="w-full px-4 py-3 bg-paradox-purple-600 text-white rounded-lg hover:bg-paradox-purple-700 transition"
              >
                {orientation === 'horizontal' ? '→ Horizontal' : '↓ Vertical'}
              </button>
            </div>
          </div>
        )}
        
        {/* Info */}
        <div className="glass p-4 rounded-xl border-2 border-yellow-500/20">
          <div className="flex gap-2 text-sm">
            <span className="text-yellow-400">💡</span>
            <div className="text-yellow-300/80">
              <p className="font-semibold mb-1">Strategy Tips:</p>
              <ul className="text-xs space-y-1">
                <li>• Spread across boards = harder to find</li>
                <li>• All on one board = easier defense</li>
                <li>• Mix with regular ships for deception</li>
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
        </div>
      
        <Board
          board={currentBoard}
          isPlayerBoard={true}
          onCellClick={handleCellClick}
          clickable={!!selectedSpecialType}
          label={selectedBoard === 'user' ? 'YOUR BOARD' : "BUDDY'S BOARD"}
          specialShips={alliesTeam.specialShips.filter(s => s.boardOwner === selectedBoard)} 
          traps={alliesTeam.bombTraps.filter(t => t.boardOwner === selectedBoard)}           
        />
        
        {selectedSpecialType && (
          <div className="text-center text-sm text-gray-400">
            Placing: <span className="text-yellow-400 font-semibold">
              {SPECIAL_SHIP_CONFIGS.find(c => c.type === selectedSpecialType)?.name}
            </span> ({orientation})
          </div>
        )}
      </div>
    </div>
  )
}