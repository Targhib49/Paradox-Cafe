import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/database/profiles'
import { Header } from '@/components/layout/Header'
import Link from 'next/link'

export const metadata = {
  title: 'Games - Blackjet',
  description: 'Choose your game',
}

export default async function GamesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const profile = await getProfile(user.id)

  if (!profile) {
    redirect('/auth/signup')
  }

  const games = [
    {
      id: 'battleship',
      name: 'Battleship Reforged',
      emoji: '⚓',
      description: 'Strategic naval combat. Place your ships and sink your opponent\'s fleet.',
      status: 'Available', // CHANGED FROM 'Coming Soon'
      color: 'from-blue-600 to-cyan-600',
      route: '/games/battleship/lobby', // ADDED ROUTE
    },
    {
      id: 'impostor',
      name: 'Impostor',
      emoji: '🕵️',
      description: 'Social deduction. Find the impostor before they deceive everyone.',
      status: 'Coming Soon',
      color: 'from-red-600 to-orange-600',
      route: '/games/impostor', // Will be added later
    },
    {
      id: 'codenames',
      name: 'Codenames',
      emoji: '🎯',
      description: 'Word association. Give one-word clues to help your team find the right words.',
      status: 'Coming Soon',
      color: 'from-green-600 to-emerald-600',
      route: '/games/codenames', // Will be added later
    },
  ]

  return (
    <div className="min-h-screen bg-paradox-dark">
      <Header profile={profile} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Game
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Each game offers a unique way to interact with the Paradox Personas. 
            Your relationships evolve differently based on how you play.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="glass p-8 rounded-2xl hover:border-white/30 transition group relative overflow-hidden"
            >
              {/* Game Icon */}
              <div className="text-6xl mb-6 text-center">{game.emoji}</div>

              {/* Game Name */}
              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                {game.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-6 text-center leading-relaxed">
                {game.description}
              </p>

              {/* Status / CTA */}
              <div className="text-center">
                {game.status === 'Available' ? (
                  <Link
                    href={game.route}
                    className={`inline-block px-6 py-3 bg-linear-to-r ${game.color} text-white font-semibold rounded-lg hover:scale-105 transition transform`}
                  >
                    Play Now
                  </Link>
                ) : (
                  <div className="px-6 py-3 bg-white/5 text-gray-500 font-semibold rounded-lg cursor-not-allowed">
                    {game.status}
                  </div>
                )}
              </div>

              {/* Hover gradient effect */}
              <div className={`absolute inset-0 bg-linear-to-br ${game.color} opacity-0 group-hover:opacity-10 transition pointer-events-none`} />
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 glass p-8 rounded-2xl">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              🎮 Development Roadmap
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400 text-xl">✓</span>
                <span className="font-semibold text-green-400">Available Now</span>
              </div>
              <p className="text-sm text-gray-400">
                Battleship Reforged 1v1 with AI difficulty levels
              </p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 text-xl">🚧</span>
                <span className="font-semibold text-yellow-400">In Progress</span>
              </div>
              <p className="text-sm text-gray-400">
                Battleship 2v2 team mode & persona system foundations
              </p>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400 text-xl">📅</span>
                <span className="font-semibold text-blue-400">Coming Soon</span>
              </div>
              <p className="text-sm text-gray-400">
                Impostor & Codenames with full persona integration
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Public launch: December 24, 2025
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-paradox-purple-400">1</p>
            <p className="text-xs text-gray-400 mt-1">Game Available</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-paradox-purple-400">3</p>
            <p className="text-xs text-gray-400 mt-1">AI Difficulties</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-paradox-purple-400">2</p>
            <p className="text-xs text-gray-400 mt-1">More Coming</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-paradox-purple-400">∞</p>
            <p className="text-xs text-gray-400 mt-1">Persona Growth</p>
          </div>
        </div>
      </main>
    </div>
  )
}