import { createClient } from '@/lib/supabase/server'
import type {
  UserPersonaProfile,
  UserPersonaProfileInsert,
  UserPersonaProfileUpdate
} from '@/lib/types'

/**
 * Get user's relationship with specific persona
 */
export async function getUserPersonaProfile(
  userId: string,
  personaId: string
): Promise<UserPersonaProfile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_persona_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('persona_id', personaId)
    .single()
  
  if (error) {
    console.error('Error fetching user persona profile:', error)
    return null
  }
  
  return data
}

/**
 * Get all user's persona relationships
 */
export async function getAllUserPersonaProfiles(
  userId: string
): Promise<UserPersonaProfile[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_persona_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('last_interaction', { ascending: false })
  
  if (error) {
    console.error('Error fetching user persona profiles:', error)
    throw error
  }
  
  return data || []
}

/**
 * Create initial persona relationship
 */
export async function createUserPersonaProfile(
  profileData: UserPersonaProfileInsert
): Promise<UserPersonaProfile> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_persona_profiles')
    .insert(profileData)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating user persona profile:', error)
    throw error
  }
  
  return data
}

/**
 * Update persona relationship (affinity, memories, etc.)
 */
export async function updateUserPersonaProfile(
  userId: string,
  personaId: string,
  updates: UserPersonaProfileUpdate
): Promise<UserPersonaProfile> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_persona_profiles')
    .update({
      ...updates,
      last_interaction: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('persona_id', personaId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating user persona profile:', error)
    throw error
  }
  
  return data
}