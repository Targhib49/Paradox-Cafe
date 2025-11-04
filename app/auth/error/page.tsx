import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paradox-dark px-4">
      <div className="text-center">
        <span className="text-6xl mb-4 inline-block">⚠️</span>
        <h1 className="text-3xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-400 mb-8">
          Something went wrong during authentication.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block px-6 py-3 bg-paradox-purple-600 text-white rounded-lg hover:bg-paradox-purple-700 transition"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}