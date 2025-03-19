
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      affirmations: {
        Row: {
          id: string
          created_at: string
          text: string
          category: string
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          text: string
          category: string
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          text?: string
          category?: string
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affirmations_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
        }
        Relationships: []
      }
      message_logs: {
        Row: {
          id: string
          user_id: string
          affirmation_id: string
          status: 'sent' | 'failed' | 'delivered'
          timestamp: string
          details: string | null
        }
        Insert: {
          id?: string
          user_id: string
          affirmation_id: string
          status: 'sent' | 'failed' | 'delivered'
          timestamp?: string
          details?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          affirmation_id?: string
          status?: 'sent' | 'failed' | 'delivered'
          timestamp?: string
          details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_logs_affirmation_id_fkey"
            columns: ["affirmation_id"]
            referencedRelation: "affirmations"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          is_admin: boolean
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          email: string
          phone: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          is_admin?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          categories: string[]
          time_preference: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          categories: string[]
          time_preference: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          categories?: string[]
          time_preference?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
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
  }
}
