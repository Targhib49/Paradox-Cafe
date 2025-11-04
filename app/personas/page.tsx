import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/database/profiles'
import { getPersonasWithRelationships } from '@/lib/database/personas'
import { Header } from '@/components/layout/Header'
import { PersonaCard } from '@/components/persona/PersonaCard'
import Link from 'next/link'

export const metadata = {
  title: 'Personas - Blackjet',
  description: 'Meet the Paradox Personas',
}

export default async function PersonasPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Allow unauthenticated users to view personas
  const profile = user ? await getProfile(user.id) : null
  
  // Get personas with or without relationships
  let personas
  if (user) {
    personas = await getPersonasWithRelationships(user.id)
  } else {
    const { data } = await supabase
      .from('personas')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
    personas = data || []
  }

  return (
    <div className="min-h-screen bg-paradox-dark">
      <Header profile={profile} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Paradox Personas
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Three AI companions, each with their own personality, philosophy, and approach to games.
            {user 
              ? ' Your relationships with them are unique and evolve with every game.'
              : ' Sign up to start building relationships with them.'}
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {personas.map((persona: any, index: number) => (
            <div key={persona.id}>
              <PersonaCard persona={persona} index={index} />
              
              {/* Show relationship if user is logged in and has relationship */}
              {user && persona.relationship && (
                <div className="mt-4 glass p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Your Relationship:</span>
                    <span className="text-sm font-semibold text-white">
                      {persona.relationship.relationship_type === 'buddy' && '🤝 Buddy'}
                      {persona.relationship.relationship_type === 'rival' && '⚔️ Rival'}
                      {persona.relationship.relationship_type === 'neutral' && '🎮 Neutral'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Affinity:</span>
                    <span className="text-white font-medium">
                      {persona.relationship.affinity}/100
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div 
                      className="bg-linear-to-r from-paradox-purple-600 to-paradox-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${persona.relationship.affinity}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-400">
                      {persona.relationship.games_played} games
                    </span>
                    <span className="text-gray-400">
                      {persona.relationship.games_won} wins
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA for non-logged in users */}
        {!user && (
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-6">
              Ready to start building relationships with these personas?
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-4 bg-linear-to-r from-paradox-purple-600 to-paradox-blue-600 text-white text-lg font-semibold rounded-xl hover:from-paradox-purple-500 hover:to-paradox-blue-500 transition transform hover:scale-105"
            >
              Create Your Account
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}