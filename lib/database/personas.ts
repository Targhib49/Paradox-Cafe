import { createClient } from '@/lib/supabase/server'
import type { Persona, PersonaWithRelationship } from '@/lib/types'

/**
 * Get all active personas ordered by display_order
 */
export async function getAllPersonas(): Promise<Persona[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  
  if (error) {
    console.error('Error fetching personas:', error)
    throw error
  }
  
  return data || []
}

/**
 * Get persona by ID
 */
export async function getPersonaById(id: string): Promise<Persona | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()
  
  if (error) {
    console.error('Error fetching persona:', error)
    return null
  }
  
  return data
}

/**
 * Get personas with user's relationship data
 */
export async function getPersonasWithRelationships(
  userId: string
): Promise<PersonaWithRelationship[]> {
  const supabase = await createClient()
  
  const { data: personas, error: personasError } = await supabase
    .from('personas')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  
  if (personasError) throw personasError
  
  const { data: relationships, error: relationshipsError } = await supabase
    .from('user_persona_profiles')
    .select('*')
    .eq('user_id', userId)
  
  if (relationshipsError) throw relationshipsError
  
  // Merge personas with their relationships
  return personas.map(persona => ({
    ...persona,
    relationship: relationships?.find(r => r.persona_id === persona.id)
  }))
}