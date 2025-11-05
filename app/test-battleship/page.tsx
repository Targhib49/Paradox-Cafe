'use client'

import { useBattleshipStore } from '@/lib/stores/battleshipStore'
import { Board } from '@/components/games/battleship/Board'
import { ShipPlacement } from '@/components/games/battleship/ShipPlacement'
import { ShipStatus } from '@/components/games/battleship/ShipStatus'
import { DifficultySelector } from '@/components/games/battleship/DifficultySelector'

export default function TestBattleshipPage() {
  const { 
    gameState, 
    userAttack,
    startNewGame 
  } = useBattleshipStore()
  
  const { phase, userBoard, aiBoard, userShips, aiShips, winner, turn } = gameState
  
  return (
    <div className="min-h-screen bg-paradox-dark p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Battleship Test Page
        </h1>
        
        {/* Phase Indicator */}
        <div className="text-center mb-8">
          <p className="text-2xl text-paradox-purple-400 font-semibold">
            Phase: {phase.toUpperCase()}
          </p>
          {phase === 'playing' && (
            <p className="text-lg text-gray-400">
              Turn: {turn === 'user' ? 'YOUR TURN' : 'AI THINKING...'}
            </p>
          )}
          {winner && (
            <p className="text-3xl font-bold text-white mt-4">
              {winner === 'user' ? '🎉 YOU WIN!' : '💔 YOU LOSE!'}
            </p>
          )}
        </div>
        
        {/* Placement Phase */}
        {phase === 'placement' && (
          <div className="mb-8">
            <DifficultySelector />
            <ShipPlacement />
          </div>
        )}
        
        {/* Playing Phase */}
        {phase === 'playing' && (
          <div>
            {/* Ship Status Displays */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <ShipStatus 
                ships={userShips} 
                label="YOUR FLEET" 
                isPlayerShips={true}
              />
              <ShipStatus 
                ships={aiShips} 
                label="ENEMY FLEET" 
                isPlayerShips={false}
              />
            </div>
            
            {/* Boards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Player Board */}
              <div className="flex justify-center">
                <Board
                  board={userBoard}
                  isPlayerBoard={true}
                  label="YOUR BOARD"
                />
              </div>
              
              {/* AI Board */}
              <div className="flex justify-center">
                <Board
                  board={aiBoard}
                  isPlayerBoard={false}
                  onCellClick={(row, col) => {
                    if (turn === 'user') {
                      userAttack({ row, col })
                    }
                  }}
                  disabled={turn !== 'user'}
                  label="ENEMY BOARD"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Game Over */}
        {phase === 'game-over' && (
          <div className="mb-8">
            {/* Final Ship Status */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <ShipStatus 
                ships={userShips} 
                label="YOUR FLEET" 
                isPlayerShips={true}
              />
              <ShipStatus 
                ships={aiShips} 
                label="ENEMY FLEET" 
                isPlayerShips={false}
              />
            </div>
            
            {/* Boards (final state) */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="flex justify-center">
                <Board
                  board={userBoard}
                  isPlayerBoard={true}
                  label="YOUR BOARD"
                  disabled={true}
                />
              </div>
              
              <div className="flex justify-center">
                <Board
                  board={aiBoard}
                  isPlayerBoard={false}
                  label="ENEMY BOARD"
                  disabled={true}
                />
              </div>
            </div>
            
            {/* New Game Button */}
            <div className="text-center">
              <button
                onClick={startNewGame}
                className="px-8 py-4 bg-paradox-blue-600 text-white text-lg rounded-lg hover:bg-paradox-blue-700 transition"
              >
                🔄 New Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}