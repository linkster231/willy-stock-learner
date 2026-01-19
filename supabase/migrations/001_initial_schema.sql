-- Willy Stock Learner - Initial Database Schema
-- This migration creates all tables needed for the app.

-- ============================================
-- EXTENSION: UUID Generation
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- Extends Supabase auth.users with app-specific data
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, preferred_language)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TABLE: module_progress
-- Tracks which modules users have started/completed
-- ============================================
CREATE TABLE public.module_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, module_id)
);

-- ============================================
-- TABLE: lesson_progress
-- Tracks individual lesson completion within modules
-- ============================================
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, module_id, lesson_id)
);

-- ============================================
-- TABLE: quiz_attempts
-- Records quiz scores and answers
-- ============================================
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),
  -- Generated columns for percentage and pass status
  percentage DECIMAL GENERATED ALWAYS AS (
    ROUND((score::DECIMAL / total_questions) * 100, 1)
  ) STORED,
  passed BOOLEAN GENERATED ALWAYS AS (
    (score::DECIMAL / total_questions) >= 0.8
  ) STORED,
  answers JSONB, -- Store individual answers for review
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: user_glossary
-- Personal word lists with spaced repetition data
-- ============================================
CREATE TABLE public.user_glossary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  term_id TEXT NOT NULL, -- References static content
  added_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed TIMESTAMPTZ,
  review_count INTEGER DEFAULT 0,
  confidence_level INTEGER DEFAULT 0 CHECK (confidence_level BETWEEN 0 AND 5),
  next_review_at TIMESTAMPTZ,
  notes TEXT, -- User's personal notes
  UNIQUE(user_id, term_id)
);

-- ============================================
-- TABLE: paper_portfolios
-- Virtual trading accounts with $100,000 starting balance
-- ============================================
CREATE TABLE public.paper_portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cash_balance DECIMAL(15, 2) DEFAULT 100000.00,
  initial_balance DECIMAL(15, 2) DEFAULT 100000.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_reset_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Auto-create portfolio when profile is created
CREATE OR REPLACE FUNCTION create_paper_portfolio()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.paper_portfolios (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_paper_portfolio();

-- ============================================
-- TABLE: paper_positions
-- Current stock holdings in paper trading
-- ============================================
CREATE TABLE public.paper_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES public.paper_portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  shares DECIMAL(15, 6) NOT NULL CHECK (shares > 0),
  average_cost DECIMAL(15, 4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, symbol)
);

-- ============================================
-- TABLE: paper_trades
-- Transaction history for paper trading
-- ============================================
CREATE TABLE public.paper_trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES public.paper_portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('buy', 'sell')),
  shares DECIMAL(15, 6) NOT NULL CHECK (shares > 0),
  price_per_share DECIMAL(15, 4) NOT NULL,
  total_value DECIMAL(15, 2) GENERATED ALWAYS AS (
    shares * price_per_share
  ) STORED,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- ============================================
-- TABLE: user_achievements
-- Gamification badges earned by users
-- ============================================
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only access their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Module progress policies
CREATE POLICY "Users can view own module progress"
  ON public.module_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own module progress"
  ON public.module_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own module progress"
  ON public.module_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Lesson progress policies
CREATE POLICY "Users can manage own lesson progress"
  ON public.lesson_progress FOR ALL
  USING (auth.uid() = user_id);

-- Quiz attempts policies
CREATE POLICY "Users can manage own quiz attempts"
  ON public.quiz_attempts FOR ALL
  USING (auth.uid() = user_id);

-- User glossary policies
CREATE POLICY "Users can manage own glossary"
  ON public.user_glossary FOR ALL
  USING (auth.uid() = user_id);

-- Paper portfolios policies
CREATE POLICY "Users can manage own portfolio"
  ON public.paper_portfolios FOR ALL
  USING (auth.uid() = user_id);

-- Paper positions policies (access via portfolio ownership)
CREATE POLICY "Users can manage own positions"
  ON public.paper_positions FOR ALL
  USING (
    portfolio_id IN (
      SELECT id FROM public.paper_portfolios WHERE user_id = auth.uid()
    )
  );

-- Paper trades policies (access via portfolio ownership)
CREATE POLICY "Users can manage own trades"
  ON public.paper_trades FOR ALL
  USING (
    portfolio_id IN (
      SELECT id FROM public.paper_portfolios WHERE user_id = auth.uid()
    )
  );

-- Achievements policies
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- INDEXES for query performance
-- ============================================
CREATE INDEX idx_module_progress_user ON public.module_progress(user_id);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_quiz_attempts_user_module ON public.quiz_attempts(user_id, module_id);
CREATE INDEX idx_user_glossary_user ON public.user_glossary(user_id);
CREATE INDEX idx_user_glossary_next_review ON public.user_glossary(user_id, next_review_at);
CREATE INDEX idx_paper_trades_portfolio ON public.paper_trades(portfolio_id);
CREATE INDEX idx_paper_positions_portfolio ON public.paper_positions(portfolio_id);
