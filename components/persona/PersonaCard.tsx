import type { Persona } from '@/lib/types'

interface PersonaCardProps {
  persona: Persona
  index?: number
}

export function PersonaCard({ persona, index = 0 }: PersonaCardProps) {
  const traits = persona.base_traits as any
  
  return (
    <div 
      className="glass p-8 rounded-2xl hover:border-paradox-purple-500 transition-all transform hover:scale-105 animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Avatar & Name */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{persona.avatar_emoji}</div>
        <h3 className="text-2xl font-bold text-white mb-1">
          {persona.name}
        </h3>
        <p className="text-paradox-purple-400 text-sm font-medium">
          {persona.archetype}
        </p>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-6 leading-relaxed">
        {persona.description}
      </p>

      {/* Philosophical Statement */}
      <div className="border-l-2 border-paradox-purple-500 pl-4 mb-6">
        <p className="text-paradox-blue-300 text-sm italic">
          "{persona.philosophical_statement}"
        </p>
      </div>

      {/* Traits */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Core Paradox:</span>
          <span className="text-paradox-purple-300 font-medium">
            {traits?.core_contradiction?.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Learning Speed:</span>
          <span className="text-paradox-blue-300 font-medium">
            {traits?.learning_speed?.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
    </div>
  )
}