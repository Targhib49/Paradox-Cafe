'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Profile } from '@/lib/types'

interface HeaderProps {
  profile?: Profile | null
}

export function Header({ profile }: HeaderProps) {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-paradox-dark/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-3xl">🌀</span>
            <div>
              <h1 className="text-xl font-bold text-white">Blackjet</h1>
              <p className="text-xs text-gray-500">Paradox Persona System</p>
            </div>
          </Link>

          {/* Navigation */}
          {profile ? (
            <div className="flex items-center gap-6">
              {/* Nav Links */}
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className={`text-sm transition ${
                    isActive('/dashboard')
                      ? 'text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/personas"
                  className={`text-sm transition ${
                    isActive('/personas')
                      ? 'text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Personas
                </Link>
                <Link
                  href="/games"
                  className={`text-sm transition ${
                    pathname.startsWith('/games')
                      ? 'text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Games
                </Link>
              </nav>

              {/* User Menu */}
              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <span className="text-sm text-gray-400 hidden sm:block">
                  {profile.display_name || profile.username}
                </span>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-linear-to-r from-paradox-purple-600 to-paradox-blue-600 text-white text-sm font-semibold rounded-lg hover:from-paradox-purple-500 hover:to-paradox-blue-500 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}