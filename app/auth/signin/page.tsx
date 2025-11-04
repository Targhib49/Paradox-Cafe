import { SignInForm } from '@/components/auth/SignInForm'
import Link from 'next/link'

export const metadata = {
  title: 'Sign In - Blackjet',
  description: 'Sign in to continue your journey with the Paradox Personas',
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-paradox-dark via-paradox-midnight to-paradox-dark px-4">
      {/* Background effect */}
      <div className="absolute inset-0 bg-paradox-glow opacity-20 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-6xl mb-4 inline-block animate-glow-pulse">🌀</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-paradox-purple-300 text-sm">
            Your personas remember you
          </p>
        </div>

        {/* Sign In Form */}
        <div className="glass p-8 rounded-2xl shadow-2xl">
          <SignInForm />
        </div>

        {/* Tagline */}
        <p className="text-center text-sm text-gray-500 mt-6 italic">
          Artificial yet authentic. Deterministic yet unpredictable.
        </p>
      </div>
    </div>
  )
}