import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/database/profiles'
import { getAllUserPersonaProfiles } from '@/lib/database/user-persona-profiles'
import { Header } from '@/components/layout/Header'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard - Blackjet',
  description: 'Your Paradox Persona System dashboard',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/signin')
  }

  const profile = await getProfile(user.id)

  if (!profile) {
    redirect('/auth/signup')
  }

  // Get user's persona relationships
  const relationships = await getAllUserPersonaProfiles(user.id)

  // Get user stats
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-paradox-dark">
      <Header profile={profile} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Welcome back, {profile.display_name || profile.username}! 🎮
          </h2>
          <p className="text-gray-400">
            {relationships.length > 0
              ? `You have relationships with ${relationships.length} persona${relationships.length > 1 ? 's' : ''}.`
              : 'Ready to meet your first persona?'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Games Played</p>
              <span className="text-2xl">🎮</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats?.total_games_played || 0}
            </p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Win Rate</p>
              <span className="text-2xl">🏆</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats?.total_games_played > 0
                ? `${Math.round((stats.total_wins / stats.total_games_played) * 100)}%`
                : '0%'}
            </p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Relationships</p>
              <span className="text-2xl">🤝</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {relationships.length}
            </p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Level</p>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats?.level || 1}
            </p>
          </div>
        </div>

        {/* Persona Relationships */}
        {relationships.length > 0 ? (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">
              Your Persona Relationships
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relationships.map((rel) => (
                <div key={rel.id} className="glass p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg font-bold text-white">
                        {/* We'd need to join with personas table to get name */}
                        Persona
                      </p>
                      <p className="text-sm text-gray-400">
                        {rel.relationship_type === 'buddy' ? '🤝 Buddy' : 
                         rel.relationship_type === 'rival' ? '⚔️ Rival' : 
                         '🎮 Neutral'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {rel.affinity}
                      </p>
                      <p className="text-xs text-gray-400">Affinity</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Games:</span>
                      <span className="text-white font-medium">{rel.games_played}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wins:</span>
                      <span className="text-white font-medium">{rel.games_won}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* First Time User CTA */
          <div className="glass p-12 rounded-2xl text-center mb-12">
            <div className="text-6xl mb-6">🌀</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Meet the three Paradox Personas: Max, Rhea, and Kai. 
              Each has a unique personality and will remember every game you play together.
            </p>
            <Link
              href="/personas"
              className="inline-block px-8 py-4 bg-linear-to-r from-paradox-purple-600 to-paradox-blue-600 text-white text-lg font-semibold rounded-xl hover:from-paradox-purple-500 hover:to-paradox-blue-500 transition transform hover:scale-105"
            >
              Meet the Personas
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/personas"
            className="glass p-8 rounded-xl hover:border-paradox-purple-500 transition group"
          >
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-paradox-purple-400 transition">
              Personas
            </h3>
            <p className="text-gray-400 text-sm">
              View all personas and your relationships with them
            </p>
          </Link>

          <Link
            href="/games"
            className="glass p-8 rounded-xl hover:border-paradox-blue-500 transition group"
          >
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-paradox-blue-400 transition">
              Play Games
            </h3>
            <p className="text-gray-400 text-sm">
              Choose from Battleship, Impostor, or Codenames
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}