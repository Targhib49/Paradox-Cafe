import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  let personas: any[] = []
  let error: string | null = null
  
  try {
    const supabase = await createClient()
    
    const { data, error: queryError } = await supabase
      .from('personas')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
    
    if (queryError) throw queryError
    
    personas = data || []
  } catch (e: any) {
    error = e.message || 'Unknown error'
    console.error('Database error:', e)
  }
  
  return (
    <div className="min-h-screen p-8 bg-paradox-dark text-white">
      <h1 className="text-3xl font-bold mb-6">🌀 Database Connection Test</h1>
      
      {error ? (
        <div className="glass p-6 border-red-500">
          <p className="text-red-400 font-medium">
            ❌ Database Error: {error}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Check your .env.local file and Supabase setup
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try visiting: <a href="/test-connection" className="text-blue-400 underline">/test-connection</a>
          </p>
        </div>
      ) : personas.length > 0 ? (
        <div className="space-y-4">
          <p className="text-green-400 font-medium">
            ✅ Successfully connected to Supabase!
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">
            Paradox Personas:
          </h2>
          
          <div className="grid gap-4">
            {personas.map((persona) => (
              <div 
                key={persona.id}
                className="glass p-6 hover:border-paradox-purple-500 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{persona.avatar_emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold">{persona.name}</h3>
                    <p className="text-paradox-purple-300 text-sm">{persona.archetype}</p>
                  </div>
                </div>
                <p className="text-gray-300 mt-3">
                  {persona.description}
                </p>
                <p className="text-paradox-blue-300 text-sm italic mt-3 pl-4 border-l-2 border-paradox-purple-500">
                  "{persona.philosophical_statement}"
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass p-6 border-yellow-500">
          <p className="text-yellow-400 font-medium">
            ⚠️ No personas found
          </p>
          <p className="text-gray-300 mt-2">
            Connection works, but database is empty.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Run the seed SQL script in Supabase SQL Editor.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            For detailed diagnostics, visit: <a href="/test-connection" className="text-blue-400 underline">/test-connection</a>
          </p>
        </div>
      )}
    </div>
  )
}