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
      issues: {
        Row: {
          id: number
          title: string
          status: string
          priority: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: number
          title: string
          status?: string
          priority?: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: number
          title?: string
          status?: string
          priority?: string
          created_at?: string
          user_id?: string
        }
      }
      users: {
        Row: {
          id: string
          full_name: string
          avatar_url: string
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string
          created_at?: string
        }
      }
    }
  }
} 