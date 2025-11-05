'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBattleshipStore } from '@/lib/stores/battleshipStore'
import { calculateGameStats } from '@/lib/game/battleship/gameLogic'
import { ShipStatus } from '@/components/games/battleship/ShipStatus'

export default function BattleshipResultPage() {
  const router = useRouter()
  const { gameState, startNewGame } = useBattleshipStore()
  const { phase, winner, userShips, aiShips, moves } = gameState
  
  // Redirect if game not over
  useEffect(() => {
    if (phase !== 'game-over' || !winner) {
      router.push('/games/battleship/lobby')
    }
  }, [phase, winner, router])
  
  if (phase !== 'game-over' || !winner) {
    return null
  }
  
  const stats = calculateGameStats(gameState)
  const isVictory = winner === 'user'
  
  const handlePlayAgain = () => {
    startNewGame()
    router.push('/games/battleship/lobby')
  }
  
  const handleHome = () => {
    router.push('/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-paradox-dark p-8">
      <div className="max-w-4xl mx-auto">
        {/* Result Header */}
        <div className="text-center mb-8">
          <div className={`inline-block glass p-8 rounded-2xl ${
            isVictory ? 'border-2 border-green-500' : 'border-2 border-red-500'
          }`}>
            <div className="text-6xl mb-4">
              {isVictory ? '🎉' : '💔'}
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${
              isVictory ? 'text-green-400' : 'text-red-400'
            }`}>
              {isVictory ? 'VICTORY!' : 'DEFEAT'}
            </h1>
            <p className="text-gray-400">
              {isVictory 
                ? 'All enemy ships have been sunk!' 
                : 'Your fleet has been destroyed...'}
            </p>
          </div>
        </div>
        
        {/* Game Statistics */}
        <div className="glass p-6 rounded-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Battle Statistics</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Your Stats */}
            <div>
              <h3 className="text-lg font-semibold text-paradox-purple-400 mb-3">
                Your Performance
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Attacks:</span>
                  <span className="text-white font-semibold">
                    {stats.userHits + stats.userMisses}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hits:</span>
                  <span className="text-green-400 font-semibold">
                    {stats.userHits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Misses:</span>
                  <span className="text-red-400 font-semibold">
                    {stats.userMisses}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-white font-bold">
                    {stats.userAccuracy.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Enemy Ships Sunk:</span>
                  <span className="text-white font-semibold">
                    {stats.userShipsSunk} / 5
                  </span>
                </div>
              </div>
            </div>
            
            {/* AI Stats */}
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-3">
                AI Performance
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Attacks:</span>
                  <span className="text-white font-semibold">
                    {stats.aiHits + stats.aiMisses}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hits:</span>
                  <span className="text-green-400 font-semibold">
                    {stats.aiHits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Misses:</span>
                  <span className="text-red-400 font-semibold">
                    {stats.aiMisses}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-white font-bold">
                    {stats.aiAccuracy.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Your Ships Sunk:</span>
                  <span className="text-white font-semibold">
                    {stats.aiShipsSunk} / 5
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Game Duration */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Battle Duration:</span>
              <span className="text-white font-bold text-lg">
                {Math.floor(stats.duration / 60)}:{(stats.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Final Fleet Status */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <ShipStatus 
            ships={userShips} 
            label="YOUR FLEET (FINAL)" 
            isPlayerShips={true}
          />
          <ShipStatus 
            ships={aiShips} 
            label="ENEMY FLEET (FINAL)" 
            isPlayerShips={false}
          />
        </div>
        
        {/* Persona Growth Placeholder */}
        <div className="glass p-6 rounded-xl mb-6 border-2 border-dashed border-paradox-purple-500/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🌟</span>
            <span>Persona Growth</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
              Coming Soon
            </span>
          </h2>
          
          <div className="space-y-3 text-sm text-gray-400">
            <p>
              In future updates, AI personas will learn from your playstyle:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-paradox-purple-400">•</span>
                <span>Track your attack patterns and strategies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-paradox-purple-400">•</span>
                <span>Adapt difficulty based on performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-paradox-purple-400">•</span>
                <span>Build relationships through repeated play</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-paradox-purple-400">•</span>
                <span>Unlock personality traits and responses</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleHome}
            className="flex-1 px-6 py-4 bg-white/5 text-white rounded-lg hover:bg-white/10 transition border border-white/20"
          >
            🏠 Home
          </button>
          <button
            onClick={handlePlayAgain}
            className="flex-1 px-6 py-4 bg-paradox-purple-600 text-white rounded-lg hover:bg-paradox-purple-700 transition font-semibold text-lg"
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    </div>
  )
}