/**
 * Supabase Database Types
 *
 * TypeScript types for the database schema.
 * These should match the tables defined in the Supabase migration.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          preferred_language: 'en' | 'es';
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          preferred_language?: 'en' | 'es';
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          preferred_language?: 'en' | 'es';
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      module_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          started_at: string;
          completed_at: string | null;
          is_completed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          started_at?: string;
          completed_at?: string | null;
          is_completed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          started_at?: string;
          completed_at?: string | null;
          is_completed?: boolean;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          lesson_id: string;
          completed_at: string;
          time_spent_seconds: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          lesson_id: string;
          completed_at?: string;
          time_spent_seconds?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          lesson_id?: string;
          completed_at?: string;
          time_spent_seconds?: number;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          score: number;
          total_questions: number;
          percentage: number;
          passed: boolean;
          answers: Json | null;
          attempted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          score: number;
          total_questions: number;
          answers?: Json | null;
          attempted_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          score?: number;
          total_questions?: number;
          answers?: Json | null;
          attempted_at?: string;
        };
      };
      user_glossary: {
        Row: {
          id: string;
          user_id: string;
          term_id: string;
          added_at: string;
          last_reviewed: string | null;
          review_count: number;
          confidence_level: number;
          next_review_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          term_id: string;
          added_at?: string;
          last_reviewed?: string | null;
          review_count?: number;
          confidence_level?: number;
          next_review_at?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          term_id?: string;
          added_at?: string;
          last_reviewed?: string | null;
          review_count?: number;
          confidence_level?: number;
          next_review_at?: string | null;
          notes?: string | null;
        };
      };
      paper_portfolios: {
        Row: {
          id: string;
          user_id: string;
          cash_balance: number;
          initial_balance: number;
          created_at: string;
          last_reset_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cash_balance?: number;
          initial_balance?: number;
          created_at?: string;
          last_reset_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          cash_balance?: number;
          initial_balance?: number;
          created_at?: string;
          last_reset_at?: string;
        };
      };
      paper_positions: {
        Row: {
          id: string;
          portfolio_id: string;
          symbol: string;
          shares: number;
          average_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          symbol: string;
          shares: number;
          average_cost: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          symbol?: string;
          shares?: number;
          average_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      paper_trades: {
        Row: {
          id: string;
          portfolio_id: string;
          symbol: string;
          action: 'buy' | 'sell';
          shares: number;
          price_per_share: number;
          total_value: number;
          executed_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          symbol: string;
          action: 'buy' | 'sell';
          shares: number;
          price_per_share: number;
          executed_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          symbol?: string;
          action?: 'buy' | 'sell';
          shares?: number;
          price_per_share?: number;
          executed_at?: string;
          notes?: string | null;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          earned_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Helper types for easier access
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ModuleProgress = Database['public']['Tables']['module_progress']['Row'];
export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];
export type UserGlossary = Database['public']['Tables']['user_glossary']['Row'];
export type PaperPortfolio = Database['public']['Tables']['paper_portfolios']['Row'];
export type PaperPosition = Database['public']['Tables']['paper_positions']['Row'];
export type PaperTrade = Database['public']['Tables']['paper_trades']['Row'];
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];
