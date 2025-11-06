'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBattleship2v2Store } from '@/lib/stores/battleship2v2Store'
import { SHIP_CONFIGS } from '@/lib/game/battleship/types'
import { Board } from '@/components/games/battleship/Board'
import { SpecialShipPlacement } from '@/components/games/battleship/SpecialShipPlacement'
import { TrapPlacement } from '@/components/games/battleship/TrapPlacement'

type SetupStep = 'regular' | 'special' | 'traps'

export default function Battleship2v2SetupPage() {
  const router = useRouter()
  const { 
    gameState, 
    placeUserRegularShip, 
    randomizeUserRegularShips, 
    confirmSetup,
    startNewGame 
  } = useBattleship2v2Store()
  
  const { userBoard, buddyBoard, alliesTeam, phase } = gameState
  
  const [currentStep, setCurrentStep] = useState<SetupStep>('regular')
  const [selectedShipType, setSelectedShipType] = useState<string | null>(SHIP_CONFIGS[0].type)
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  
  // Redirect if not in placement phase
  useEffect(() => {
    if (phase !== 'placement') {
      router.push('/games/battleship/lobby')
    }
  }, [phase, router])
  
  // Get user's regular ships (first 5 are user's, rest will be buddy's after setup)
  const userRegularShips = alliesTeam.regularShips.filter((ship, index) => {
    // During setup, only user's ships are placed
    return alliesTeam.regularShips.length <= 5 ? true : index < 5
  })
  
  // Get unplaced ships
  const unplacedShips = SHIP_CONFIGS.filter(
    config => !userRegularShips.some(ship => ship.type === config.type)
  )
  
  const handleCellClick = (row: number, col: number) => {
    if (currentStep !== 'regular' || !selectedShipType) return
    
    const success = placeUserRegularShip({ row, col }, selectedShipType, orientation)
    
    if (success) {
      // Auto-select next unplaced ship
      const nextUnplaced = SHIP_CONFIGS.find(
        config => !userRegularShips.some(ship => ship.type === config.type) && config.type !== selectedShipType
      )
      setSelectedShipType(nextUnplaced?.type || null)
      
      // If all placed, auto-advance after a brief delay
      if (userRegularShips.length === 4) { // Will be 5 after this one
        setTimeout(() => setCurrentStep('special'), 500)
      }
    }
  }
  
  const toggleOrientation = () => {
    setOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')
  }
  
  const handleClearAll = () => {
    if (confirm('Clear all ships and start over?')) {
      startNewGame()
      setCurrentStep('regular')
      setSelectedShipType(SHIP_CONFIGS[0].type)
    }
  }
  
  const handleConfirmAndStart = () => {
    confirmSetup()
    router.push('/games/battleship/play-2v2')
  }
  
  const canProceedToSpecial = userRegularShips.length === 5
  const canProceedToTraps = alliesTeam.specialShips.length === 3
  const canStartGame = alliesTeam.bombTraps.length === 3
  
  // Helper to get special ships by board
  const getUserSpecialShips = () => 
    alliesTeam.specialShips.filter(s => s.boardOwner === 'user')
  
  const getBuddySpecialShips = () => 
    alliesTeam.specialShips.filter(s => s.boardOwner === 'buddy')
  
  // Helper to get traps by board
  const getUserTraps = () => 
    alliesTeam.bombTraps.filter(t => t.boardOwner === 'user')
  
  const getBuddyTraps = () => 
    alliesTeam.bombTraps.filter(t => t.boardOwner === 'buddy')
  
  return (
    <div className="min-h-screen bg-paradox-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            2v2 Fleet Setup
          </h1>
          <p className="text-gray-400">
            Prepare your team for battle
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="glass p-2 rounded-xl inline-flex gap-2">
            <button
              onClick={() => setCurrentStep('regular')}
              disabled={currentStep === 'regular'}
              className={`px-6 py-3 rounded-lg transition ${
                currentStep === 'regular'
                  ? 'bg-paradox-purple-600 text-white'
                  : canProceedToSpecial
                  ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
                  : 'bg-white/5 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {canProceedToSpecial && <span>✓</span>}
                <span>1. Regular Ships</span>
              </div>
            </button>
            
            <button
              onClick={() => canProceedToSpecial && setCurrentStep('special')}
              disabled={!canProceedToSpecial || currentStep === 'special'}
              className={`px-6 py-3 rounded-lg transition ${
                currentStep === 'special'
                  ? 'bg-paradox-purple-600 text-white'
                  : canProceedToTraps
                  ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
                  : canProceedToSpecial
                  ? 'bg-white/5 text-white hover:bg-white/10'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2">
                {canProceedToTraps && <span>✓</span>}
                <span>2. Special Ships ⭐</span>
              </div>
            </button>
            
            <button
              onClick={() => canProceedToTraps && setCurrentStep('traps')}
              disabled={!canProceedToTraps || currentStep === 'traps'}
              className={`px-6 py-3 rounded-lg transition ${
                currentStep === 'traps'
                  ? 'bg-paradox-purple-600 text-white'
                  : canStartGame
                  ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
                  : canProceedToTraps
                  ? 'bg-white/5 text-white hover:bg-white/10'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2">
                {canStartGame && <span>✓</span>}
                <span>3. Bomb Traps 💣</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="mb-8">
          {/* STEP 1: Regular Ships */}
          {currentStep === 'regular' && (
            <div className="grid lg:grid-cols-[320px_1fr] gap-8">
              {/* Controls */}
              <div className="space-y-4">
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Your Regular Ships
                  </h3>
                  
                  <div className="space-y-2">
                    {SHIP_CONFIGS.map(config => {
                      const isPlaced = userRegularShips.some(ship => ship.type === config.type)
                      const isSelected = selectedShipType === config.type
                      
                      return (
                        <button
                          key={config.type}
                          onClick={() => !isPlaced && setSelectedShipType(config.type)}
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
                        {userRegularShips.length} / 5
                      </span>
                    </div>
                  </div>
                </div>
                
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
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <button
                      onClick={randomizeUserRegularShips}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                    >
                      🎲 Randomize All
                    </button>
                    
                    <button
                      onClick={handleClearAll}
                      disabled={userRegularShips.length === 0}
                      className="w-full px-4 py-3 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed border border-red-700"
                    >
                      🗑️ Clear All
                    </button>
                    
                    {canProceedToSpecial && (
                      <button
                        onClick={() => setCurrentStep('special')}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        Next: Special Ships →
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Board Area */}
              <div className="flex-1 space-y-8">
                {/* Your Board */}
                <div className="flex flex-col items-center gap-4">
                  <Board
                    board={userBoard}
                    isPlayerBoard={true}
                    onCellClick={handleCellClick}
                    clickable={true}
                    label="YOUR BOARD"
                    specialShips={getUserSpecialShips()}
                    traps={getUserTraps()}
                  />
                  
                  {selectedShipType && (
                    <div className="text-center text-sm text-gray-400 glass px-4 py-2 rounded-lg">
                      Placing: <span className="text-white font-semibold">
                        {SHIP_CONFIGS.find(c => c.type === selectedShipType)?.name}
                      </span> ({orientation})
                    </div>
                  )}
                </div>
                
                {/* Buddy's Board Preview */}
                <div className="flex flex-col items-center gap-4">
                  <div className="glass px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <span>🤖</span>
                      <span>Buddy's ships will be auto-placed</span>
                    </p>
                  </div>
                  <Board
                    board={buddyBoard}
                    isPlayerBoard={true}
                    disabled={true}
                    label="BUDDY'S BOARD (Preview)"
                    specialShips={getBuddySpecialShips()}
                    traps={getBuddyTraps()}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* STEP 2: Special Ships */}
          {currentStep === 'special' && (
            <div>
              <SpecialShipPlacement />
              
              {canProceedToTraps && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setCurrentStep('traps')}
                    className="px-8 py-4 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Next: Bomb Traps →
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* STEP 3: Traps */}
          {currentStep === 'traps' && (
            <div>
              <TrapPlacement />
              
              {canStartGame && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleConfirmAndStart}
                    className="px-12 py-5 bg-linear-to-r from-green-600 to-emerald-600 text-white text-xl rounded-lg hover:scale-105 transition font-bold shadow-lg"
                  >
                    ⚓ Launch 2v2 Battle!
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Helper Info */}
        <div className="glass p-4 rounded-xl border-2 border-blue-500/20">
          <div className="flex gap-3 text-sm">
            <span className="text-blue-400 text-xl">💡</span>
            <div className="text-blue-300">
              <p className="font-semibold mb-2">2v2 Setup Tips:</p>
              <ul className="text-xs text-blue-200/80 space-y-1">
                <li>• <strong>Regular Ships:</strong> 5 decoy ships on YOUR board only</li>
                <li>• <strong>Special Ships:</strong> 3 win-condition ships (can place on your board OR buddy's board)</li>
                <li>• <strong>Bomb Traps:</strong> 3 defensive traps (can place on either allied board)</li>
                <li>• <strong>Strategy:</strong> Spread special ships for confusion, or cluster for defense</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}