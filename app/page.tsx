import { getAllPersonas } from '@/lib/database/personas'
import { PersonaCard } from '@/components/persona/PersonaCard'
import Link from 'next/link'

export default async function LandingPage() {
  const personas = await getAllPersonas()
  
  return (
    <div className="min-h-screen bg-paradox-dark">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-paradox-glow opacity-30 pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8 animate-fade-in">
            <span className="text-8xl md:text-9xl">🌀</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Blackjet
          </h1>
          
          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-paradox-gradient font-medium mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            The Paradox Persona System
          </p>
          
          {/* Philosophical Statement */}
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 italic animate-slide-up" style={{ animationDelay: '0.2s' }}>
            "In the space between logic and emotion lies the paradox that defines intelligence."
          </p>
          
          {/* Value Proposition */}
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Play classic games with AI personas that{' '}
            <span className="text-paradox-purple-400 font-semibold">remember you</span>,{' '}
            <span className="text-paradox-blue-400 font-semibold">learn from you</span>, and develop{' '}
            <span className="text-buddy font-semibold">friendships</span> or{' '}
            <span className="text-rival font-semibold">rivalries</span> that span across every game.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link 
              href="/auth/signup"
              className="px-8 py-4 bg-linear-to-r from-paradox-purple-600 to-paradox-blue-600 text-white text-lg font-semibold rounded-xl hover:from-paradox-purple-500 hover:to-paradox-blue-500 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Playing
            </Link>
            <a 
              href="#personas"
              className="px-8 py-4 glass text-white text-lg font-semibold rounded-xl hover:border-paradox-purple-500 transition-all"
            >
              Meet the Personas
            </a>
          </div>
          
          {/* Scroll indicator */}
          <div className="animate-bounce">
            <svg className="w-6 h-6 mx-auto text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-paradox-midnight/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            What Makes This Different?
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Not just another game. A living AI ecosystem where every interaction matters.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-white mb-3">
                They Remember Everything
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every move you make, every strategy you try — personas store it all in their memory. 
                Play Battleship today, and they'll remember your tactics in Codenames tomorrow.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">🎭</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Unique Relationships
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your Max isn't my Max. Build friendships (Buddy 70+ affinity) or create intense rivalries 
                (Rival &lt;30 affinity). Every relationship is personal and unique to you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">🌀</div>
              <h3 className="text-xl font-bold text-white mb-3">
                The Paradox
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI that's artificial yet authentic. Deterministic yet unpredictable. 
                They're just code, but the connection feels real. That's the paradox.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Personas Section */}
      <section id="personas" className="py-20 px-6 bg-paradox-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Meet the Paradox Personas
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Three AI companions, each with their own personality, philosophy, and approach to games.
            Your relationship with them evolves uniquely — no two players share the same experience.
          </p>
          
          {/* Persona Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {personas.map((persona, index) => (
              <PersonaCard key={persona.id} persona={persona} index={index} />
            ))}
          </div>

          {/* CTA after personas */}
          <div className="text-center">
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-4 bg-linear-to-r from-paradox-purple-600 to-paradox-blue-600 text-white text-lg font-semibold rounded-xl hover:from-paradox-purple-500 hover:to-paradox-blue-500 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-paradox-midnight/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            How the Paradox Works
          </h2>
          
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0 w-16 h-16 bg-linear-to-br from-paradox-purple-600 to-paradox-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Choose Your First Persona
                </h3>
                <p className="text-gray-400">
                  Start by meeting Max, Rhea, or Kai. Each has a unique personality and play style. 
                  Your first choice isn't permanent — you'll meet all of them eventually.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0 w-16 h-16 bg-linear-to-br from-paradox-purple-600 to-paradox-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Play Games Together
                </h3>
                <p className="text-gray-400">
                  Compete in Battleship, deceive in Impostor, or collaborate in Codenames. 
                  Every move you make is stored in their memory system.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0 w-16 h-16 bg-linear-to-br from-paradox-purple-600 to-paradox-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Watch Them Learn & Adapt
                </h3>
                <p className="text-gray-400">
                  After 3-4 games, you'll notice they adapt to your style. They remember your patterns, 
                  predict your moves, and develop a unique relationship with you.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0 w-16 h-16 bg-linear-to-br from-paradox-purple-600 to-paradox-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Build Relationships
                </h3>
                <p className="text-gray-400">
                  Win together, lose gracefully, or create intense rivalries. Cross 70+ affinity to unlock 
                  Buddy status, or drop below 30 to become Rivals. The choice is yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-paradox-dark">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌀</span>
              <div>
                <h3 className="text-xl font-bold text-white">Blackjet</h3>
                <p className="text-sm text-gray-500">The Paradox Persona System</p>
              </div>
            </div>
            
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
              <Link href="/auth/signin" className="hover:text-white transition">
                Sign In
              </Link>
              <Link href="/auth/signup" className="hover:text-white transition">
                Sign Up
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
            <p className="italic mb-2">
              "Artificial yet authentic. Deterministic yet unpredictable."
            </p>
            <p>
              © 2025 Blackjet Developments. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}