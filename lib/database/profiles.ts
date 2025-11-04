import { createClient } from '@/lib/supabase/server'
import type { Profile, ProfileInsert, ProfileUpdate } from '@/lib/types'

/**
 * Get user profile by ID
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}

/**
 * Create new user profile
 */
export async function createProfile(
  profileData: ProfileInsert
): Promise<Profile> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating profile:', error)
    throw error
  }
  
  return data
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<Profile> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }
  
  return data
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()
  
  // If error (not found), username is available
  // If data exists, username is taken
  return !data
}

/**
 * Get profile by username
 */
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()
  
  if (error) {
    console.error('Error fetching profile by username:', error)
    return null
  }
  
  return data
}