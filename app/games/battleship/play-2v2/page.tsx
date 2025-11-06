'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBattleship2v2Store } from '@/lib/stores/battleship2v2Store'
import { FourBoardLayout } from '@/components/games/battleship/FourBoardLayout'
import { AttackFeedback } from '@/components/games/battleship/AttackFeedback'
import { MoveHistory } from '@/components/games/battleship/MoveHistory'

export default function Battleship2v2PlayPage() {
  const router = useRouter()
  const {
    gameState,
    isPaused,
    pauseGame,
    resumeGame,
    surrender,
    selectUserTarget,
    executeUserAttack,
    userSelectedTarget
  } = useBattleship2v2Store()
  
  const {
    phase,
    userBoard,
    buddyBoard,
    enemy1Board,
    enemy2Board,
    alliesTeam,
    enemiesTeam,
    turnPhase,
    startedAt,
    winner,
    skippedPlayers,
    moves
  } = gameState
  
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showPauseMenu, setShowPauseMenu] = useState(false)
  const [attackFeedback, setAttackFeedback] = useState<{
    result: 'hit' | 'miss' | 'sunk' | 'trap' | null
    position?: { row: number; col: number }
    shipType?: string
  }>({ result: null })
  
  // Show feedback when new move is made
  useEffect(() => {
    if (moves.length > 0) {
      const lastMove = moves[moves.length - 1]
      setAttackFeedback({
        result: lastMove.result as any,
        position: lastMove.target,
        shipType: lastMove.shipSunk
      })
    }
  }, [moves.length])
  
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
  
  // Check game over
  useEffect(() => {
    if (winner) {
      setTimeout(() => {
        router.push('/games/battleship/result-2v2')
      }, 2000)
    }
  }, [winner, router])
  
  // Redirect if not playing
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
  
  const handleEnemyBoardClick = (board: 'enemy1' | 'enemy2', row: number, col: number) => {
    if (turnPhase !== 'allies' || isPaused || userSkipped) return
    selectUserTarget(board, { row, col })
  }
  
  const handleFireAttack = () => {
    if (!userSelectedTarget) return
    executeUserAttack()
  }
  
  const handleCancelTarget = () => {
    selectUserTarget(null as any, { row: 0, col: 0 })
  }
  
  const getUserSpecialShips = () => 
    alliesTeam.specialShips.filter(s => s.boardOwner === 'user')
  
  const getBuddySpecialShips = () => 
    alliesTeam.specialShips.filter(s => s.boardOwner === 'buddy')
  
  const getUserTraps = () => 
    alliesTeam.bombTraps.filter(t => t.boardOwner === 'user')
  
  const getBuddyTraps = () => 
    alliesTeam.bombTraps.filter(t => t.boardOwner === 'buddy')
  
  if (phase !== 'playing') {
    return null
  }
  
  const userSkipped = skippedPlayers.includes('user')
  const buddySkipped = skippedPlayers.includes('buddy')
  
  return (
    <div className="min-h-screen bg-paradox-dark p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Attack Feedback */}
        <AttackFeedback
          result={attackFeedback.result}
          position={attackFeedback.position}
          shipType={attackFeedback.shipType}
          onComplete={() => setAttackFeedback({ result: null })}
        />
        
        {/* Game Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">
              ⚓ Battleship 2v2
            </h1>
            <div className="glass px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">⏱️</span>
                <span className="font-mono text-white font-semibold">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>
          
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
            turnPhase === 'allies' ? 'border-2 border-green-500' : 'border-2 border-red-500'
          }`}>
            <p className="text-2xl font-bold text-white">
              {turnPhase === 'allies' ? '🎯 YOUR TEAM\'S TURN' : '⏳ ENEMY TEAM ATTACKING...'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {turnPhase === 'allies' 
                ? userSkipped 
                  ? '⚠️ Your turn is skipped (trap triggered)!'
                  : buddySkipped
                  ? '⚠️ Buddy\'s turn is skipped (trap triggered)!'
                  : 'You and Buddy attack simultaneously'
                : 'Defending against enemy attacks'}
            </p>
          </div>
        </div>
        
        {/* Team Health & Move History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">YOUR TEAM</span>
              <div className="flex gap-1">
                {alliesTeam.specialShips.map((ship, i) => (
                  <span key={i} className={`text-2xl ${ship.sunk ? 'opacity-30' : ''}`}>
                    {ship.sunk ? '☆' : '⭐'}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {alliesTeam.specialShips.filter(s => !s.sunk).length} / {alliesTeam.specialShips.length} remaining
            </div>
          </div>
          
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">ENEMY TEAM</span>
              <div className="flex gap-1">
                {enemiesTeam.specialShips.map((ship, i) => (
                  <span key={i} className={`text-2xl ${ship.sunk ? 'opacity-30' : ''}`}>
                    {ship.sunk ? '☆' : '⭐'}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {enemiesTeam.specialShips.filter(s => !s.sunk).length} / {enemiesTeam.specialShips.length} remaining
            </div>
          </div>
          
          <MoveHistory moves={moves} />
        </div>
        
        {/* 4 Boards */}
        <FourBoardLayout
          userBoard={userBoard}
          buddyBoard={buddyBoard}
          enemy1Board={enemy1Board}
          enemy2Board={enemy2Board}
          userSpecialShips={getUserSpecialShips()}
          buddySpecialShips={getBuddySpecialShips()}
          userTraps={getUserTraps()}
          buddyTraps={getBuddyTraps()}
          onEnemy1BoardClick={(row, col) => handleEnemyBoardClick('enemy1', row, col)}
          onEnemy2BoardClick={(row, col) => handleEnemyBoardClick('enemy2', row, col)}
          phase={phase}
          currentTurn={turnPhase}
          disabled={isPaused || userSkipped}
        />
        
        {/* Selected Target Display */}
        {userSelectedTarget && turnPhase === 'allies' && !isPaused && !userSkipped && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 glass p-4 rounded-xl border-2 border-green-500 shadow-2xl z-50">
            <div className="flex items-center gap-4">
              <div className="text-white">
                <p className="font-semibold">Target Selected:</p>
                <p className="text-sm text-gray-400">
                  {userSelectedTarget.board === 'enemy1' ? 'Enemy 1' : 'Enemy 2'} - 
                  Cell {String.fromCharCode(65 + userSelectedTarget.position.col)}{userSelectedTarget.position.row + 1}
                </p>
              </div>
              <button
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                onClick={handleFireAttack}
              >
                🎯 FIRE!
              </button>
              <button
                onClick={handleCancelTarget}
                className="px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Skip Turn Indicator */}
        {userSkipped && turnPhase === 'allies' && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 glass p-4 rounded-xl border-2 border-yellow-500 shadow-2xl z-50">
            <div className="text-center text-white">
              <p className="font-semibold text-yellow-400">💣 Turn Skipped!</p>
              <p className="text-sm text-gray-400 mt-1">
                You triggered a trap. Buddy attacks for your team this turn.
              </p>
            </div>
          </div>
        )}
        
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