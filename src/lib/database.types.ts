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
      profiles: {
        Row: {
          id: string
          name: string
          role: 'student' | 'teacher' | 'parent'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role: 'student' | 'teacher' | 'parent'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'student' | 'teacher' | 'parent'
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          code: string
          teacher_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          teacher_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          teacher_id?: string
          created_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          genre: string
          description: string | null
          cover_url: string | null
          reading_level: string | null
          pages: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          genre: string
          description?: string | null
          cover_url?: string | null
          reading_level?: string | null
          pages?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          genre?: string
          description?: string | null
          cover_url?: string | null
          reading_level?: string | null
          pages?: number
          created_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          title: string
          description: string | null
          instructions: string | null
          book_id: string | null
          class_id: string
          teacher_id: string
          due_date: string
          max_score: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          instructions?: string | null
          book_id?: string | null
          class_id: string
          teacher_id: string
          due_date: string
          max_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          instructions?: string | null
          book_id?: string | null
          class_id?: string
          teacher_id?: string
          due_date?: string
          max_score?: number
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          content: string | null
          status: 'not-started' | 'in-progress' | 'submitted' | 'graded'
          score: number | null
          feedback: string | null
          submitted_at: string | null
          graded_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          content?: string | null
          status?: 'not-started' | 'in-progress' | 'submitted' | 'graded'
          score?: number | null
          feedback?: string | null
          submitted_at?: string | null
          graded_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          content?: string | null
          status?: 'not-started' | 'in-progress' | 'submitted' | 'graded'
          score?: number | null
          feedback?: string | null
          submitted_at?: string | null
          graded_at?: string | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          rarity: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          rarity?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          rarity?: string
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
        }
      }
      reading_progress: {
        Row: {
          id: string
          user_id: string
          book_id: string
          status: 'reading' | 'completed' | 'wishlist'
          progress: number
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          status?: 'reading' | 'completed' | 'wishlist'
          progress?: number
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          status?: 'reading' | 'completed' | 'wishlist'
          progress?: number
          started_at?: string
          completed_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      class_enrollments: {
        Row: {
          id: string
          class_id: string
          student_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          enrolled_at?: string
        }
      }
      parent_child_links: {
        Row: {
          id: string
          parent_id: string
          child_id: string
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          child_id: string
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          child_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'teacher' | 'parent'
      assignment_status: 'not-started' | 'in-progress' | 'submitted' | 'graded'
      reading_status: 'reading' | 'completed' | 'wishlist'
    }
  }
}