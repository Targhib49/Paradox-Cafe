'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBattleshipStore } from '@/lib/stores/battleshipStore'
import { Board } from '@/components/games/battleship/Board'
import { ShipStatus } from '@/components/games/battleship/ShipStatus'

export default function BattleshipPlayPage() {
  const router = useRouter()
  const { 
    gameState, 
    userAttack,
    isPaused,
    pauseGame,
    resumeGame,
    surrender
  } = useBattleshipStore()
  
  const { phase, userBoard, aiBoard, userShips, aiShips, winner, turn, startedAt } = gameState
  
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showPauseMenu, setShowPauseMenu] = useState(false)
  
  // Timer
  useEffect(() => {
    if (phase !== 'playing' || isPaused || !startedAt) return
    
    const interval = setInterval(() => {
      const now = new Date()
      const elapsed = Math.floor((now.getTime() - startedAt.getTime()) / 1000)
      setElapsedTime(elapsed)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [phase, isPaused, startedAt])
  
  // Check if game is over
  useEffect(() => {
    if (winner) {
      router.push('/games/battleship/result')
    }
  }, [winner, router])
  
  // Redirect if not in playing phase
  useEffect(() => {
    if (phase !== 'playing') {
      router.push('/games/battleship/lobby')
    }
  }, [phase, router])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const handlePauseToggle = () => {
    if (isPaused) {
      resumeGame()
      setShowPauseMenu(false)
    } else {
      pauseGame()
      setShowPauseMenu(true)
    }
  }
  
  const handleSurrender = () => {
    if (confirm('Are you sure you want to surrender?')) {
      surrender()
    }
  }
  
  if (phase !== 'playing') {
    return null // Will redirect
  }
  
  return (
    <div className="min-h-screen bg-paradox-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">
              ⚓ Battleship
            </h1>
            {/* Timer */}
            <div className="glass px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">⏱️</span>
                <span className="font-mono text-white font-semibold">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Game Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePauseToggle}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button
              onClick={handleSurrender}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              🏳️ Surrender
            </button>
          </div>
        </div>
        
        {/* Turn Indicator */}
        <div className="text-center mb-6">
          <div className={`inline-block glass px-6 py-3 rounded-xl ${
            turn === 'user' ? 'border-2 border-green-500' : 'border-2 border-orange-500'
          }`}>
            <p className="text-2xl font-bold text-white">
              {turn === 'user' ? '🎯 YOUR TURN' : '⏳ AI THINKING...'}
            </p>
          </div>
        </div>
        
        {/* Ship Status */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
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
              onCellClick={(row, col) => {
                if (turn === 'user' && !isPaused) {
                  userAttack({ row, col })
                }
              }}
              disabled={turn !== 'user' || isPaused}
              label="ENEMY BOARD - Attack here!"
              clickable={turn === 'user' && !isPaused}
            />
          </div>
        </div>
        
        {/* Pause Overlay */}
        {showPauseMenu && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="glass p-8 rounded-2xl max-w-md w-full mx-4">
              <h2 className="text-3xl font-bold text-white text-center mb-6">
                ⏸️ Game Paused
              </h2>
              
              <div className="space-y-3">
                <button
                  onClick={handlePauseToggle}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-semibold"
                >
                  ▶️ Resume Game
                </button>
                
                <button
                  onClick={handleSurrender}
                  className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  🏳️ Surrender
                </button>
                
                <button
                  onClick={() => {
                    if (confirm('Return to lobby? (Progress will be lost)')) {
                      router.push('/games/battleship/lobby')
                    }
                  }}
                  className="w-full px-6 py-4 bg-white/5 text-white rounded-lg hover:bg-white/10 transition border border-white/20"
                >
                  🏠 Exit to Lobby
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}