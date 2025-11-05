'use client'

import type { Difficulty } from '@/lib/game/battleship/types'
import { useBattleshipStore } from '@/lib/stores/battleshipStore'

export function DifficultySelector() {
  const { difficulty, setDifficulty } = useBattleshipStore()
  
  const difficulties: { value: Difficulty; label: string; description: string; emoji: string }[] = [
    {
      value: 'easy',
      label: 'Easy',
      description: 'Random shooting. Good for beginners.',
      emoji: '😊'
    },
    {
      value: 'medium',
      label: 'Medium',
      description: 'Hunt & target mode. Balanced challenge.',
      emoji: '😐'
    },
    {
      value: 'hard',
      label: 'Hard',
      description: 'Probability-based. For experts.',
      emoji: '😈'
    }
  ]
  
  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-4">AI Difficulty</h3>
      
      <div className="space-y-3">
        {difficulties.map(diff => (
          <button
            key={diff.value}
            onClick={() => setDifficulty(diff.value)}
            className={`w-full p-4 rounded-lg border-2 transition text-left ${
              difficulty === diff.value
                ? 'bg-paradox-purple-600 border-paradox-purple-400 text-white'
                : 'bg-white/5 border-white/20 text-white hover:border-paradox-purple-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{diff.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-lg">{diff.label}</p>
                <p className="text-sm opacity-75">{diff.description}</p>
              </div>
              {difficulty === diff.value && (
                <span className="text-xl">✓</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}