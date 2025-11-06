'use client'

import { useBattleship2v2Store } from '@/lib/stores/battleship2v2Store'
import { SpecialShipPlacement } from '@/components/games/battleship/SpecialShipPlacement'
import { TrapPlacement } from '@/components/games/battleship/TrapPlacement'
import { FourBoardLayout } from '@/components/games/battleship/FourBoardLayout'

export default function Test2v2Page() {
  const { gameState, randomizeUserRegularShips } = useBattleship2v2Store()
  const { phase, userBoard, buddyBoard, enemy1Board, enemy2Board } = gameState
  
  return (
    <div className="min-h-screen bg-paradox-dark p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          2v2 Test Page
        </h1>
        
        {phase === 'placement' && (
          <div className="space-y-8">
            <button
              onClick={randomizeUserRegularShips}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              1. Randomize Regular Ships
            </button>
            
            <SpecialShipPlacement />
            
            <TrapPlacement />
          </div>
        )}
        
        <div className="mt-8">
          <FourBoardLayout
            userBoard={userBoard}
            buddyBoard={buddyBoard}
            enemy1Board={enemy1Board}
            enemy2Board={enemy2Board}
            phase={phase}
          />
        </div>
      </div>
    </div>
  )
}