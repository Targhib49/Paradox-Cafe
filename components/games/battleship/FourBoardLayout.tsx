'use client'

import type { Board as BoardType, Player, SpecialShip, BombTrap } from '@/lib/game/battleship/types'
import { Board } from './Board'

interface FourBoardLayoutProps {
  // Ally boards (top row)
  userBoard: BoardType
  buddyBoard: BoardType
  
  // Enemy boards (bottom row)
  enemy1Board: BoardType
  enemy2Board: BoardType
  
  // NEW: Ship and trap data
  userSpecialShips?: SpecialShip[]
  buddySpecialShips?: SpecialShip[]
  userTraps?: BombTrap[]
  buddyTraps?: BombTrap[]
  
  // Callbacks
  onUserBoardClick?: (row: number, col: number) => void
  onBuddyBoardClick?: (row: number, col: number) => void
  onEnemy1BoardClick?: (row: number, col: number) => void
  onEnemy2BoardClick?: (row: number, col: number) => void
  
  // State
  phase: 'placement' | 'playing' | 'game-over'
  currentTurn?: 'allies' | 'enemies'
  disabled?: boolean
}

export function FourBoardLayout({
  userBoard,
  buddyBoard,
  enemy1Board,
  enemy2Board,
  userSpecialShips = [],
  buddySpecialShips = [],
  userTraps = [],
  buddyTraps = [],
  onUserBoardClick,
  onBuddyBoardClick,
  onEnemy1BoardClick,
  onEnemy2BoardClick,
  phase,
  currentTurn,
  disabled = false
}: FourBoardLayoutProps) {
  
  const isPlaying = phase === 'playing'
  const canAttack = isPlaying && currentTurn === 'allies' && !disabled
  
  return (
    <div className="w-full">
      {/* Section Labels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-400">
            ⚓ YOUR TEAM
          </h2>
          <p className="text-sm text-gray-400">Defend your fleet</p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400">
            🎯 ENEMY TEAM
          </h2>
          <p className="text-sm text-gray-400">
            {canAttack ? 'Click to attack!' : 'Enemy waters'}
          </p>
        </div>
      </div>
      
      {/* 4 Boards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Left: Your Board */}
        <div className="flex justify-center">
          <Board
            board={userBoard}
            isPlayerBoard={true}
            onCellClick={onUserBoardClick}
            disabled={!onUserBoardClick}
            clickable={!!onUserBoardClick}
            label="YOUR BOARD"
            specialShips={userSpecialShips}
            traps={userTraps}
          />
        </div>
        
        {/* Top Right: Buddy Board */}
        <div className="flex justify-center">
          <Board
            board={buddyBoard}
            isPlayerBoard={true}
            onCellClick={onBuddyBoardClick}
            disabled={!onBuddyBoardClick}
            clickable={!!onBuddyBoardClick}
            label="BUDDY'S BOARD"
            specialShips={buddySpecialShips}
            traps={buddyTraps}
          />
        </div>
        
        {/* Bottom Left: Enemy 1 Board */}
        <div className="flex justify-center">
          <Board
            board={enemy1Board}
            isPlayerBoard={false}
            onCellClick={onEnemy1BoardClick}
            disabled={!canAttack}
            clickable={canAttack}
            label="ENEMY 1 BOARD"
          />
        </div>
        
        {/* Bottom Right: Enemy 2 Board */}
        <div className="flex justify-center">
          <Board
            board={enemy2Board}
            isPlayerBoard={false}
            onCellClick={onEnemy2BoardClick}
            disabled={!canAttack}
            clickable={canAttack}
            label="ENEMY 2 BOARD"
          />
        </div>
      </div>
    </div>
  )
}