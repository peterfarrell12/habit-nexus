import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          icon: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color: string
          icon: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          icon?: string
          created_at?: string
          user_id?: string
        }
      }
      habit_logs: {
        Row: {
          id: string
          habit_id: string
          completed_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          habit_id: string
          completed_at: string
          notes?: string | null
        }
        Update: {
          id?: string
          habit_id?: string
          completed_at?: string
          notes?: string | null
        }
      }
    }
  }
}