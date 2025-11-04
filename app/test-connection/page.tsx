import { createClient } from '@/lib/supabase/server'

export default async function TestConnectionPage() {
  let connectionStatus = 'Testing...'
  let error: any = null
  let personas: any = null
  let rawEnv = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
  }

  try {
    // Test 1: Create client
    const supabase = await createClient()
    connectionStatus = 'Client created ✅'

    // Test 2: Simple query
    const { data, error: queryError, count } = await supabase
      .from('personas')
      .select('*', { count: 'exact' })

    if (queryError) {
      throw queryError
    }

    personas = data
    connectionStatus = 'Query successful ✅'
  } catch (e: any) {
    error = e
    connectionStatus = 'Failed ❌'
  }

  return (
    <div className="min-h-screen p-8 bg-paradox-dark text-white">
      <h1 className="text-3xl font-bold mb-6">🔍 Connection Debug</h1>

      {/* Environment Check */}
      <div className="glass p-6 mb-4">
        <h2 className="text-xl font-bold mb-3">Environment Variables</h2>
        <div className="space-y-2 font-mono text-sm">
          <div>
            <span className="text-gray-400">NEXT_PUBLIC_SUPABASE_URL:</span>
            <span className={rawEnv.url ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
              {rawEnv.url ? `${rawEnv.url.substring(0, 30)}...` : '❌ NOT SET'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
            <span className={rawEnv.keyLength > 0 ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
              {rawEnv.keyLength > 0 ? `${rawEnv.keyLength} characters ✅` : '❌ NOT SET'}
            </span>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="glass p-6 mb-4">
        <h2 className="text-xl font-bold mb-3">Connection Status</h2>
        <p className="text-lg">{connectionStatus}</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass p-6 mb-4 border-red-500">
          <h2 className="text-xl font-bold mb-3 text-red-400">Error Details</h2>
          <pre className="bg-black/50 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      {/* Results */}
      {personas && (
        <div className="glass p-6">
          <h2 className="text-xl font-bold mb-3 text-green-400">
            ✅ Found {personas.length} Personas
          </h2>
          <div className="space-y-3">
            {personas.map((p: any) => (
              <div key={p.id} className="bg-black/30 p-3 rounded">
                <p className="font-bold">{p.avatar_emoji} {p.name}</p>
                <p className="text-sm text-gray-400">{p.archetype}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!error && personas && personas.length === 0 && (
        <div className="glass p-6 border-yellow-500">
          <h2 className="text-xl font-bold mb-3 text-yellow-400">
            ⚠️ No Personas Found
          </h2>
          <p className="text-gray-300">
            Connection works, but no data in database.
            <br />
            Run the seed SQL script in Supabase SQL Editor.
          </p>
        </div>
      )}
    </div>
  )
}