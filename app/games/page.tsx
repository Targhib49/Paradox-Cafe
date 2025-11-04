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
      status: 'Coming Soon',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      id: 'impostor',
      name: 'Impostor',
      emoji: '🕵️',
      description: 'Social deduction. Find the impostor before they deceive everyone.',
      status: 'Coming Soon',
      color: 'from-red-600 to-orange-600',
    },
    {
      id: 'codenames',
      name: 'Codenames',
      emoji: '🎯',
      description: 'Word association. Give one-word clues to help your team find the right words.',
      status: 'Coming Soon',
      color: 'from-green-600 to-emerald-600',
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
                    href={`/games/${game.id}`}
                    className={`inline-block px-6 py-3 bg-linear-to-r ${game.color} text-white font-semibold rounded-lg hover:scale-105 transition transform`}
                  >
                    Play Now
                  </Link>
                ) : (
                  <div className="px-6 py-3 bg-white/5 text-gray-500 font-semibold rounded-lg">
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
        <div className="mt-16 glass p-8 rounded-2xl text-center">
          <p className="text-gray-400 mb-4">
            <span className="font-semibold text-white">Games are coming soon!</span> 
            {' '}We're building Battleship first, followed by Impostor and Codenames.
          </p>
          <p className="text-sm text-gray-500">
            Public launch: December 24, 2025
          </p>
        </div>
      </main>
    </div>
  )
}