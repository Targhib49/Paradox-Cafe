'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AttackFeedbackProps {
  result: 'hit' | 'miss' | 'sunk' | 'trap' | null
  position?: { row: number; col: number }
  shipType?: string
  onComplete?: () => void
}

export function AttackFeedback({ 
  result, 
  position, 
  shipType,
  onComplete 
}: AttackFeedbackProps) {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    if (result) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        onComplete?.()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [result, onComplete])
  
  if (!result || !show) return null
  
  const getMessage = () => {
    switch (result) {
      case 'hit':
        return {
          emoji: '🎯',
          title: 'HIT!',
          color: 'text-orange-400',
          bg: 'bg-orange-500/20',
          border: 'border-orange-500'
        }
      case 'miss':
        return {
          emoji: '💧',
          title: 'Miss',
          color: 'text-blue-400',
          bg: 'bg-blue-500/20',
          border: 'border-blue-500'
        }
      case 'sunk':
        return {
          emoji: '💥',
          title: shipType ? `${shipType.toUpperCase()} SUNK!` : 'SHIP SUNK!',
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500'
        }
      case 'trap':
        return {
          emoji: '💣',
          title: 'TRAP TRIGGERED!',
          color: 'text-purple-400',
          bg: 'bg-purple-500/20',
          border: 'border-purple-500'
        }
      default:
        return null
    }
  }
  
  const message = getMessage()
  if (!message) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <div className={`glass p-8 rounded-2xl border-2 ${message.border} ${message.bg}`}>
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-4"
            >
              {message.emoji}
            </motion.div>
            <h2 className={`text-3xl font-bold ${message.color}`}>
              {message.title}
            </h2>
            {position && (
              <p className="text-sm text-gray-400 mt-2">
                {String.fromCharCode(65 + position.col)}{position.row + 1}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}