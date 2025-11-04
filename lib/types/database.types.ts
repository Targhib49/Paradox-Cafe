export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      personas: {
        Row: {
          id: string
          name: string
          archetype: string
          description: string | null
          philosophical_statement: string | null
          avatar_url: string | null
          avatar_emoji: string | null
          base_traits: Json
          game_preferences: Json
          is_active: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          archetype: string
          description?: string | null
          philosophical_statement?: string | null
          avatar_url?: string | null
          avatar_emoji?: string | null
          base_traits?: Json
          game_preferences?: Json
          is_active?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          archetype?: string
          description?: string | null
          philosophical_statement?: string | null
          avatar_url?: string | null
          avatar_emoji?: string | null
          base_traits?: Json
          game_preferences?: Json
          is_active?: boolean
          display_order?: number
          created_at?: string
        }
        Relationships: []
      }
      user_persona_profiles: {
        Row: {
          id: string
          user_id: string
          persona_id: string
          relationship_type: 'buddy' | 'rival' | 'neutral'
          affinity: number
          competitiveness: number
          games_played: number
          games_won: number
          skill_data: Json
          memory_data: Json
          first_interaction: string
          last_interaction: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          persona_id: string
          relationship_type?: 'buddy' | 'rival' | 'neutral'
          affinity?: number
          competitiveness?: number
          games_played?: number
          games_won?: number
          skill_data?: Json
          memory_data?: Json
          first_interaction?: string
          last_interaction?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          persona_id?: string
          relationship_type?: 'buddy' | 'rival' | 'neutral'
          affinity?: number
          competitiveness?: number
          games_played?: number
          games_won?: number
          skill_data?: Json
          memory_data?: Json
          first_interaction?: string
          last_interaction?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_persona_profiles_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_persona_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string
          game_type: 'battleship' | 'impostor' | 'codenames'
          mode: 'solo' | 'coop' | 'pvp'
          persona_id: string | null
          opponent_persona_id: string | null
          result: Json | null
          winner: 'user' | 'ai' | 'draw' | null
          score: Json | null
          duration_seconds: number | null
          moves_count: number
          started_at: string
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_type: 'battleship' | 'impostor' | 'codenames'
          mode?: 'solo' | 'coop' | 'pvp'
          persona_id?: string | null
          opponent_persona_id?: string | null
          result?: Json | null
          winner?: 'user' | 'ai' | 'draw' | null
          score?: Json | null
          duration_seconds?: number | null
          moves_count?: number
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_type?: 'battleship' | 'impostor' | 'codenames'
          mode?: 'solo' | 'coop' | 'pvp'
          persona_id?: string | null
          opponent_persona_id?: string | null
          result?: Json | null
          winner?: 'user' | 'ai' | 'draw' | null
          score?: Json | null
          duration_seconds?: number | null
          moves_count?: number
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_opponent_persona_id_fkey"
            columns: ["opponent_persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      game_actions: {
        Row: {
          id: string
          session_id: string
          actor: 'user' | 'ai'
          actor_persona_id: string | null
          action_type: string
          action_data: Json
          turn_number: number | null
          timestamp: string
        }
        Insert: {
          id?: string
          session_id: string
          actor: 'user' | 'ai'
          actor_persona_id?: string | null
          action_type: string
          action_data?: Json
          turn_number?: number | null
          timestamp?: string
        }
        Update: {
          id?: string
          session_id?: string
          actor?: 'user' | 'ai'
          actor_persona_id?: string | null
          action_type?: string
          action_data?: Json
          turn_number?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_actions_actor_persona_id_fkey"
            columns: ["actor_persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_actions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      user_stats: {
        Row: {
          user_id: string
          total_games_played: number
          total_wins: number
          total_losses: number
          total_draws: number
          total_playtime_seconds: number
          game_stats: Json
          achievements: string[]
          current_win_streak: number
          longest_win_streak: number
          current_daily_streak: number
          last_played_date: string | null
          level: number
          experience_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          total_games_played?: number
          total_wins?: number
          total_losses?: number
          total_draws?: number
          total_playtime_seconds?: number
          game_stats?: Json
          achievements?: string[]
          current_win_streak?: number
          longest_win_streak?: number
          current_daily_streak?: number
          last_played_date?: string | null
          level?: number
          experience_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_games_played?: number
          total_wins?: number
          total_losses?: number
          total_draws?: number
          total_playtime_seconds?: number
          game_stats?: Json
          achievements?: string[]
          current_win_streak?: number
          longest_win_streak?: number
          current_daily_streak?: number
          last_played_date?: string | null
          level?: number
          experience_points?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper type aliases for simpler usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]