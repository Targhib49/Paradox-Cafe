'use client'

import type { Ship } from '@/lib/game/battleship/types'

interface ShipStatusProps {
  ships: Ship[]
  label: string
  isPlayerShips: boolean
}

export function ShipStatus({ ships, label, isPlayerShips }: ShipStatusProps) {
  return (
    <div className="glass p-4 rounded-xl">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">{label}</h3>
      
      <div className="space-y-2">
        {ships.map(ship => {
          const healthPercent = ((ship.length - ship.hits) / ship.length) * 100
          
          return (
            <div key={ship.id} className="flex items-center gap-3">
              {/* Ship Name */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  ship.sunk ? 'text-red-400 line-through' : 'text-white'
                }`}>
                  {ship.type.charAt(0).toUpperCase() + ship.type.slice(1)}
                </p>
              </div>
              
              {/* Health Bar */}
              <div className="flex-1">
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      ship.sunk 
                        ? 'bg-red-900' 
                        : healthPercent > 50 
                        ? 'bg-green-500' 
                        : healthPercent > 25
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${healthPercent}%` }}
                  />
                </div>
              </div>
              
              {/* Status */}
              <div className="text-xs font-mono text-gray-400 w-12 text-right">
                {ship.sunk ? (
                  <span className="text-red-400">SUNK</span>
                ) : (
                  <span>{ship.length - ship.hits}/{ship.length}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Ships Remaining:</span>
          <span className="text-white font-semibold">
            {ships.filter(s => !s.sunk).length} / {ships.length}
          </span>
        </div>
      </div>
    </div>
  )
}