'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Basic validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      // 2. Create profile in database
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            display_name: username,
          })

        if (profileError) {
          // Username might be taken
          if (profileError.code === '23505') {
            throw new Error('Username already taken')
          }
          throw profileError
        }

        // Success!
        setSuccess(true)
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 2000)
      }
    } catch (err: any) {
      console.error('Sign up error:', err)
      setError(err.message || 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="glass p-6 rounded-xl border-green-500">
        <p className="text-green-400 font-medium text-center">
          ✅ Account created successfully!
        </p>
        <p className="text-gray-300 text-sm text-center mt-2">
          Redirecting to dashboard...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          required
          minLength={3}
          maxLength={20}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-paradox-purple-500 focus:border-transparent transition"
          placeholder="Choose a username"
        />
        <p className="text-xs text-gray-400 mt-1">
          3-20 characters, lowercase letters, numbers, and underscores only
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-paradox-purple-500 focus:border-transparent transition"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-paradox-purple-500 focus:border-transparent transition"
          placeholder="At least 6 characters"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-linear-to-r from-paradox-purple-600 to-paradox-blue-600 text-white rounded-lg font-medium hover:from-paradox-purple-700 hover:to-paradox-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>

      <div className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link 
          href="/auth/signin" 
          className="text-paradox-purple-400 hover:text-paradox-purple-300 font-medium transition"
        >
          Sign in
        </Link>
      </div>
    </form>
  )
}