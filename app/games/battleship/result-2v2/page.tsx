'use client'

import { useRouter } from 'next/navigation'
import { useBattleship2v2Store } from '@/lib/stores/battleship2v2Store'

export default function Battleship2v2ResultPage() {
  const router = useRouter()
  const { gameState, startNewGame } = useBattleship2v2Store()
  const { winner } = gameState
  
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
            winner === 'user' ? 'border-2 border-green-500' : 'border-2 border-red-500'
          }`}>
            <div className="text-6xl mb-4">
              {winner === 'user' ? '🎉' : '💔'}
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${
              winner === 'user' ? 'text-green-400' : 'text-red-400'
            }`}>
              {winner === 'user' ? 'VICTORY!' : 'DEFEAT'}
            </h1>
            <p className="text-gray-400">
              {winner === 'user' 
                ? 'Your team sunk all enemy special ships!' 
                : 'Your team\'s special ships were destroyed...'}
            </p>
          </div>
        </div>
        
        {/* Placeholder for stats */}
        <div className="glass p-8 rounded-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Battle Statistics
          </h2>
          <p className="text-gray-400 text-center py-8">
            Detailed 2v2 statistics coming soon...
          </p>
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