import { Database } from './database.types'

// Table row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Persona = Database['public']['Tables']['personas']['Row']
export type UserPersonaProfile = Database['public']['Tables']['user_persona_profiles']['Row']
export type GameSession = Database['public']['Tables']['game_sessions']['Row']
export type GameAction = Database['public']['Tables']['game_actions']['Row']
export type UserStats = Database['public']['Tables']['user_stats']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type UserPersonaProfileInsert = Database['public']['Tables']['user_persona_profiles']['Insert']
export type GameSessionInsert = Database['public']['Tables']['game_sessions']['Insert']
export type GameActionInsert = Database['public']['Tables']['game_actions']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type UserPersonaProfileUpdate = Database['public']['Tables']['user_persona_profiles']['Update']
export type GameSessionUpdate = Database['public']['Tables']['game_sessions']['Update']

// Enums
export type RelationshipType = 'buddy' | 'rival' | 'neutral'
export type GameType = 'battleship' | 'impostor' | 'codenames'
export type GameMode = 'solo' | 'coop' | 'pvp'
export type Actor = 'user' | 'ai'
export type Winner = 'user' | 'ai' | 'draw'

// Extended types with relationships
export interface PersonaWithRelationship extends Persona {
  relationship?: UserPersonaProfile
}

export interface PersonaTraits {
  personality: string
  aggression: number
  patience: number
  risk_taking: number
  learning_speed: string
  core_contradiction: string
  communication_style: string
  emotional_range: string
}

export interface GamePreferences {
  [gameName: string]: {
    skill: number
    play_style: string
    preferred_difficulty: string
    favorite_tactics: string[]
  }
}

// Simplified and flexible MemoryData type
export interface MemoryData {
  [key: string]: any
  cross_game_insights?: {
    personality?: string
    learning_speed?: string
    preferred_interaction?: string
    [key: string]: any
  }
  emotional_moments?: string[]
}

// Auth types
export interface User {
  id: string
  email: string
  profile?: Profile
}

// UI State types
export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}