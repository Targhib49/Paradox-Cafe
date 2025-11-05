'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBattleshipStore } from '@/lib/stores/battleshipStore'
import type { Difficulty } from '@/lib/game/battleship/types'

type GameMode = '1v1' | '2v2'

export default function BattleshipLobbyPage() {
  const router = useRouter()
  const { setDifficulty, startNewGame } = useBattleshipStore()
  
  const [selectedMode, setSelectedMode] = useState<GameMode>('1v1')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')
  const [usePersona, setUsePersona] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  
  const handleStartGame = () => {
    setDifficulty(selectedDifficulty)
    startNewGame()
    router.push('/games/battleship/setup')
  }
  
  return (
    <div className="min-h-screen bg-paradox-dark p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ⚓ Battleship
          </h1>
          <p className="text-gray-400">
            Configure your game settings
          </p>
        </div>
        
        {/* Settings Grid */}
        <div className="grid gap-6">
          
          {/* Game Mode Selection */}
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Game Mode</h2>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                Select mode
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* 1v1 Mode */}
              <button
                onClick={() => setSelectedMode('1v1')}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedMode === '1v1'
                    ? 'bg-paradox-purple-600 border-paradox-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-white hover:border-paradox-purple-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🎯</span>
                  {selectedMode === '1v1' && <span className="text-lg">✓</span>}
                </div>
                <p className="font-semibold">1v1 Classic</p>
                <p className="text-xs opacity-75 mt-1">
                  You vs AI opponent
                </p>
              </button>
              
              {/* 2v2 Mode - Coming Soon */}
              <button
                disabled
                className="p-4 rounded-lg border-2 border-dashed border-white/10 text-gray-500 text-left cursor-not-allowed relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                  Coming Soon
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl opacity-50">🤝</span>
                </div>
                <p className="font-semibold">2v2 Teams</p>
                <p className="text-xs opacity-75 mt-1">
                  You + Buddy vs AI Team
                </p>
              </button>
            </div>
          </div>
          
          {/* Opponent Selection */}
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Opponent</h2>
              <button
                onClick={() => setUsePersona(!usePersona)}
                className="text-xs text-paradox-purple-400 hover:text-paradox-purple-300 transition"
              >
                {usePersona ? 'Use AI Difficulty' : 'Use Persona (Preview)'}
              </button>
            </div>
            
            {!usePersona ? (
              // AI Difficulty Selector (Compact)
              <div className="space-y-2">
                {[
                  { value: 'easy' as Difficulty, label: 'Easy', emoji: '😊', desc: 'Random shooting' },
                  { value: 'medium' as Difficulty, label: 'Medium', emoji: '😐', desc: 'Hunt & target' },
                  { value: 'hard' as Difficulty, label: 'Hard', emoji: '😈', desc: 'Probability-based' }
                ].map(diff => (
                  <button
                    key={diff.value}
                    onClick={() => setSelectedDifficulty(diff.value)}
                    className={`w-full p-3 rounded-lg border-2 transition text-left ${
                      selectedDifficulty === diff.value
                        ? 'bg-paradox-purple-600 border-paradox-purple-400 text-white'
                        : 'bg-white/5 border-white/20 text-white hover:border-paradox-purple-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{diff.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{diff.label}</p>
                        <p className="text-xs opacity-75">{diff.desc}</p>
                      </div>
                      {selectedDifficulty === diff.value && (
                        <span className="text-lg">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Persona Selector (Placeholder)
              <div className="space-y-2">
                {[
                  { id: 'max', name: 'Max', emoji: '🧠', trait: 'The Strategist', locked: true },
                  { id: 'rhea', name: 'Rhea', emoji: '✨', trait: 'The Charmer', locked: true },
                  { id: 'kai', name: 'Kai', emoji: '🎭', trait: 'The Thinker', locked: true }
                ].map(persona => (
                  <button
                    key={persona.id}
                    disabled={persona.locked}
                    className="w-full p-3 rounded-lg border-2 border-dashed border-white/10 text-gray-500 text-left cursor-not-allowed relative"
                  >
                    <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
                      Locked
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl opacity-50">{persona.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{persona.name}</p>
                        <p className="text-xs opacity-75">{persona.trait}</p>
                      </div>
                      <span className="text-lg">🔒</span>
                    </div>
                  </button>
                ))}
                <p className="text-xs text-center text-gray-500 mt-3">
                  Persona system coming in future update
                </p>
              </div>
            )}
          </div>
          
          {/* Future Features Placeholder */}
          <div className="glass p-6 rounded-xl border-2 border-dashed border-white/10">
            <h2 className="text-xl font-bold text-gray-500 mb-3">
              🚀 Coming Soon
            </h2>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>⏱️</span>
                <span>Ranked Matchmaking</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👥</span>
                <span>Real Multiplayer (PvP)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎨</span>
                <span>Custom Board Themes</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📊</span>
                <span>Statistics & Leaderboards</span>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 px-6 py-4 bg-white/5 text-white rounded-lg hover:bg-white/10 transition border border-white/20"
          >
            ← Back
          </button>
          <button
            onClick={handleStartGame}
            className="flex-1 px-6 py-4 bg-paradox-purple-600 text-white rounded-lg hover:bg-paradox-purple-700 transition font-semibold text-lg"
          >
            Start Game →
          </button>
        </div>
      </div>
    </div>
  )
}